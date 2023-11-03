import styles from "./MaterialPage.module.css"
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import AddModal from "../../UI/Editpad/Components/AddModal";
import { useSelector, useDispatch } from 'react-redux'
import {Tooltip} from '@gravity-ui/uikit';

import axios from "axios";
import classNames from 'classnames';
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
    const [titleTooltip, setTitleTooltip] = useState("")
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
          setTitleTooltip(materialJsonData.material_title);
          
          document.title = (materialJsonData.material_title).slice(1, -1);
          if ((materialJsonData.material_title).length >= 23) {
            setMaterial_title((materialJsonData.material_title).slice(0, 23) + "...")
          } else {
              setMaterial_title(materialJsonData.material_title)
          }
        
        } catch (error) {
        console.error(error);
        // Handle the error, e.g., set an error state or display an error message to the user
        }
    };

    useEffect(() => {
        fetchData();



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
            <NavBar/>
            <div className={styles.title_block_reference}>
                <CardBtn deleteFunc={deleteFunc} editFunc={editFunc} pre_title={'материал'} title={(material_title).slice(1, -1)}  full_title={titleTooltip}/>
            </div>
            
          
            <div className={styles.main_space_reference}>
                <div className={styles.main_space}>
                    
                    <div className={styles.block_with_mainButtonsCards}>

                        <Tooltip content="В разработке. Уже скоро добавим!" className={styles.notification_window}>
                          <div className={classNames(styles.card, styles.main_from_text)}>
                              <div className={classNames(styles.icon_block_reference, styles.pdf_icon_block_reference)}>
                                  <div id="warning" className={styles.icon_warning}></div>
                              </div>
                              <div className={styles.title_block_in_card}>
                                  <span style={{color: "#B061FF"}} className={styles.card_title}>Выделить главное</span>
                              </div>
                          </div>
                        </Tooltip>
                        
                        <Tooltip content="В разработке. Уже скоро добавим!" className={styles.notification_window}>
                          <div className={classNames(styles.card, styles.test_icon)}>
                              <div className={classNames(styles.icon_block_reference, styles.pdf_icon_block_reference)}>
                                  <img src={test_icon} className={styles.icon_pdf} alt="" />
                              </div>
                              <div className={styles.title_block_in_card}>
                                  <span style={{color: "#38D9E5"}} className={styles.card_title}>Создать тест</span>
                              </div>
                          </div>
                        </Tooltip>

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
