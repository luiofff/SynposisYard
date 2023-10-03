import styles from "./MaterialPage.module.css"
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import AddModal from "../../UI/Editpad/Components/AddModal";
import { useSelector, useDispatch } from 'react-redux'
import { openModal } from '../../Redux/modalSlice';

import axios from "axios";
import classNames from 'classnames';
import pdf_logo from "./assets/pdf_logo.svg"
import AnimatedCubsButton from '../../UI/buttons/AnimatedCubsButton/AnimatedCubsButton';
import animationFolder from "./assets/animations/folder.json"
import test_icon from "./assets/test_icon.svg"
import animationWarning from "./assets/animations/warning.json"
import lottie from "lottie-web";
import Notepad from "../../UI/Editpad/Notepad";
import CardBtn from "../../UI/buttons/CardButton/CardButton";
import see from "./assets/see.svg"


const PdfCard = ({ card_title }) => {
    return (
      <>
        <div className={styles.cardPdf}>
          <div className={styles.card_detailsPdf}>
            <p className={styles.text_titlePdf}>{ card_title }</p>
          </div>
          <button className={styles.card_buttonPdf}>
            <img src={see} alt="" />
          </button>
        </div>
      </>
    );
};


export default function MaterialPage() {
    const dispatch = useDispatch()
    const modal_state = useSelector(state => state.modal.modalOpen)
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState('');
    const { disciplineId, topicId, materialId } = useParams();
    const [modalOpen, setmodalOpen] = useState(true);
    const [material, setMaterial] = useState("");
    const [material_title, setMaterial_title] = useState("");
    
    // functions for delete and edit buttons

    const editData = useSelector(state => state.editData.editData)

    const deleteFunc = async () => {
        try {
          const deleteDiscipline = await fetch(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/${materialId}/DeleteMaterial`, {
            method: "DELETE"
          });
        } catch (err) {
          console.error(err.message);
        }
    }

    const editFunc = async () => {
        try {
          console.log(editData)
          const updateDiscipline = await axios.put(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/${materialId}/updateMaterialData`, {
            material_data: JSON.stringify(editData)
          });
    
          
        } catch (err) {
          console.error(err.message);
        }
      }

    // ________________________________________

    const toggleOpen = () => {
        setmodalOpen(!modalOpen);
    }
   

    const fetchData = async () => {
        try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const user_id = JSON.parse(atob(token.split('.')[1])).email;

        const userResponse = await fetch(`http://localhost:8080/user?user_id=${user_id}`, {
            headers: {
            Authorization: token,
            },
        });
        const userJsonData = await userResponse.json();
        setUserName(userJsonData.username);

    
        
        const getMaterialData = await fetch(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/${materialId}`)
        if (!getMaterialData.ok) {
            throw new Error('Discipline not found');
          }
          const materialJsonData = await getMaterialData.json();
          setMaterial(materialJsonData.material_data);
          setMaterial_title(materialJsonData.material_title);
        } catch (error) {
        console.error(error);
        // Handle the error, e.g., set an error state or display an error message to the user
        }
    };

    useEffect(() => {
        fetchData();
        // folder animation settings
        const animationContainerFolder = document.querySelector("#folder");
        const animationInstanceFolder = lottie.loadAnimation({
        container: animationContainerFolder,
        animationData: animationFolder,
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



        // warning animation settings

        const animationContainerWarning = document.querySelector("#warning");
        const animationInstanceWarning = lottie.loadAnimation({
        container: animationContainerWarning,
        animationData: animationWarning,
        loop: false,
        default: false
        });
        animationInstanceWarning.stop();
        animationContainerWarning.addEventListener("mouseenter", () => {
        animationInstanceWarning.play();
        });
        animationContainerWarning.addEventListener("mouseleave", () => {
        animationInstanceWarning.stop();
        });
    }, [disciplineId]);


    return (
        <>
            <NavBar
                menu_data_first="Войти"
                btn_data={userName}
                btn_data_href="/login"
                menu_data_second="Регистрация"
                menu_data_first_href="/login"
                menu_data_second_href="/registration"
            />
            <div className={styles.title_block_reference}>
                <CardBtn deleteFunc={deleteFunc} editFunc={editFunc} pre_title={'материал'} title={(material_title).slice(1, -1)}/>
            </div>
            

            <div className={styles.main_space_reference}>
                <div className={styles.main_space}>
                    
                    <div className={styles.block_with_mainButtonsCards}>
                        <div onClick={() => dispatch(openModal())} className={classNames(styles.card, styles.add_card)}>
                            <div className={classNames(styles.icon_block_reference, styles.add_icon_block_reference)}>
                                <div id="folder" className={styles.icon_warning}></div>
                            </div>
                            <div className={styles.title_block_in_card}>
                                <span style={{color: "#1969fe"}} className={styles.card_title}>Добавить</span>
                            </div>
                        </div>

                        <div className={classNames(styles.card, styles.pdf_card)}>
                            <div className={classNames(styles.icon_block_reference, styles.pdf_icon_block_reference)}>
                                <img src={pdf_logo} className={styles.icon_pdf} alt="" />
                            </div>
                            <div className={styles.title_block_in_card}>
                                <span style={{color: "#ff1c1c"}} className={styles.card_title}>PDF</span>
                            </div>
                        </div>

                        <div className={classNames(styles.card, styles.main_from_text)}>
                            <div className={classNames(styles.icon_block_reference, styles.pdf_icon_block_reference)}>
                                <div id="warning" className={styles.icon_warning}></div>
                            </div>
                            <div className={styles.title_block_in_card}>
                                <span style={{color: "#B061FF"}} className={styles.card_title}>Выделить главное</span>
                            </div>
                        </div>

                        <div className={classNames(styles.card, styles.test_icon)}>
                            <div className={classNames(styles.icon_block_reference, styles.pdf_icon_block_reference)}>
                                <img src={test_icon} className={styles.icon_pdf} alt="" />
                            </div>
                            <div className={styles.title_block_in_card}>
                                <span style={{color: "#38D9E5"}} className={styles.card_title}>Создать тест</span>
                            </div>
                        </div>

                    </div>
                    
                    <div className={styles.pdfCard_space}>
                        <PdfCard card_title={"название"}/>
                    </div>
                

                    <div className={classNames(styles.block_material)}>
                        <Notepad disciplineId={disciplineId} topicId={topicId} material={material} materialId={materialId}/>
                    </div>
                </div>
            </div>
            
            {modal_state===false ? "" : <AddModal topicId={topicId} materialId={materialId} disciplineId={disciplineId} />}
        </>
    )
}
