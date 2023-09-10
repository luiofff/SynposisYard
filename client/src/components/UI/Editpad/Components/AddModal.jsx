import React from 'react'
import styles from "./AddModal.module.css"
import close from "../assets/close.json"
import lottie from "lottie-web";
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../../../Redux/modalSlice';
import axios from 'axios';
import { getDocument } from 'pdfjs-dist';
import { ContentState } from 'draft-js';

export default function AddModal({topicId, materialId, disciplineId}) {
    const dispatch = useDispatch()

    const modal_state = useSelector(state => state.modal.modalOpen)

    const [active, setActive] = React.useState(2);
    const [close_modal, setClose] = React.useState(true);
    const [material, setMaterial] = React.useState("");

    const toggleClose = () => {
        setClose(!close_modal);
    }



    const toggleSwitch = () => {
        if (active===1) {
            setActive(2);
        } else {
            setActive(1);
        }
    }


    const pdfConvertor = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = async (e) => {
            const contents = e.target.result;
            const pdf = await getDocument(contents).promise;
            const numPages = pdf.numPages;
            let extractedText = '';
            
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(' ');
                extractedText += pageText;
            }
            setMaterial(ContentState.createFromText(extractedText));
            
        };
    
        reader.readAsArrayBuffer(file);
        }
    
    const handleSaveClick = async () => {
        try {
          const updateDiscipline = await axios.put(
              `http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/${materialId}/updateMaterialData`,
              {
                material_data: material,
              }
        );
      } catch (err) {
        console.error(err.message);
      }
    };

    React.useEffect(() => {
        // folder animation settings
        const animationContainerFolder = document.querySelector("#close_icon");
        const animationInstanceFolder = lottie.loadAnimation({
        container: animationContainerFolder,
        animationData: close,
        loop: false,
        default: false
        });
        animationInstanceFolder.stop();
        animationContainerFolder.addEventListener("mouseenter", () => {
            animationInstanceFolder.play();
        });
        animationContainerFolder.addEventListener("mouseleave", () => {
            animationInstanceFolder.stop();
        });
        
    }, []);

  return (
    <>
        <div className={styles.modal_background}></div>
        <div className={styles.modal_refernce}>
            <div className={styles.main_modal}>
                <nav className={styles.modal_navbar}>
                    <div onClick={() => dispatch(closeModal())} id='close_icon' className={styles.close_icon}></div>
                </nav>

                <div className={styles.filed_space_reference}>
                    <button onClick={toggleSwitch} className={`${styles["toggle_btn"]} ${active==1 ? "" : styles.active_mode}`}>
                        <span className={styles.toggle_btn_text}>WORD</span>
                    </button>
                    <button onClick={toggleSwitch} className={`${styles["toggle_btn"]} ${active==2 ? "" : styles.active_mode}`}>
                        <span className={styles.toggle_btn_text}>PDF</span>
                    </button>
                </div>
                
                
                {active===1 ?
                    <form className={styles.form}>
                        <span className={styles.form_title}>Загрузить PDF</span>
                        <label  className={styles.drop_container}>
                            <span className={styles.drop_title}>Перенесите файл сюда</span>
                            <input type="file" accept="application/pdf" onChange={pdfConvertor} required="" className={styles.file_input}></input>
                        </label>
                    </form>
                    : ""
                }
            
                {active===2 ?
                    <form className={styles.form}>
                        <span className={styles.form_title}>Загрузить WORD или TXT</span>
                        <label  className={styles.drop_container}>
                            <span className={styles.drop_title}>Перенесите файл сюда</span>
                            <input type="file" accept="application/pdf" required="" className={styles.file_input}></input>
                        </label>
                    </form>
                    : ""
                }
                
                

                <button onClick={handleSaveClick}>Save</button>
            </div>
        </div>
    </>
  )
}
