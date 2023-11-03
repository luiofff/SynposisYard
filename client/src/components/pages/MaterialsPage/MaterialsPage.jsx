import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import classNames from 'classnames';
import plus_icon from "../TopicsPage/assets/add_topic_icon.svg"
import search_icon from "../SubjectsPage/assets/search_icon.svg";
import styles from "./MaterialsPage.module.css"
import SubscriptionElement from '../../UI/buttons/SubscriptionElement/SubscriptionElement';
import {  useSelector } from 'react-redux'
import axios from "axios"
import {Modal} from '@gravity-ui/uikit';
import CardBtn from '../../UI/buttons/CardButton/CardButton';

export default function TopicsPage() {

    const [userName, setUserName] = useState('');
    const { disciplineId, topicId } = useParams();
    const [topic_title , setTopicTitle] = useState("");
    const [materials, setMaterials] = useState([]);
    const [material_title, setMaterial_title] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = React.useState(false);
    const [newMaterial, setNewMaterial] = useState("");
    const [titleTooltip, setTitleTooltip] = useState("")

    const editData = useSelector(state => state.editData.editData)

    const deleteFunc = async () => {
        try {
          const deleteDiscipline = await fetch(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/deleteTitle`, {
            method: "DELETE"
          });
          window.history.go(-1)
        } catch (err) {
          console.error(err.message);
        }
    }

    const editFunc = async () => {
        try {
          const updateDiscipline = await axios.put(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/updateTitle`, {
            topic_title: JSON.stringify(editData)
          });
          window.location.reload();
          
        } catch (err) {
          console.error(err.message);
        }
      }

    // ________________________________________

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
          const content = `"${newMaterial}"`
          const body = { material_title: content };
          const response = await fetch(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/addmaterial`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          setNewMaterial("");
          setOpen(false)
          window.location.reload();
        } catch (err) {
          console.error(err.message);
        }
    };

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

        const getTopicTitle = await fetch(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/getuniq`);
        const getTopicTitleJson = await getTopicTitle.json();
        setTitleTooltip(getTopicTitleJson.topic_title)
        if ((getTopicTitleJson.topic_title).length >= 23) {
            setMaterial_title((getTopicTitleJson.topic_title).slice(0, 23) + "...")
        } else {
            setMaterial_title(getTopicTitleJson.topic_title)
        }
        

     

        axios.get(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}`, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) =>  setMaterials(res.data))
        .catch((err) => console.error(err));
        document.title = "Материалы " + (getTopicTitleJson.topic_title).slice(1, -1);

        } catch (error) {
        console.error(error);
        // Handle the error, e.g., set an error state or display an error message to the user
        }
    };

    useEffect(() => {
        document.title = "Темы";
        fetchData();
    }, [disciplineId]);

    return (
        <>
            <NavBar />
            <Modal open={open} onClose={() => setOpen(false)}>
                <form onSubmit={onSubmitForm} className={styles.modal_window}>
                <div className={styles.input_block_modal}>
                    <input type="text"
                    onChange={(e) => setNewMaterial(e.target.value)}
                    className={styles.input_modal}
                    placeholder='Название...'
                    />
                </div>
                <button type="submit" className={styles.add_btn} onClick={() => setOpen(false)}>
                    Добавить
                </button>
                </form>
            </Modal>

            <CardBtn 
                disciplineId={disciplineId} 
                deleteFunc={deleteFunc} 
                editFunc={editFunc} 
                title={material_title.slice(1, -1)} 
                full_title={titleTooltip}
                pre_title={"Материалы по теме:"}
            />

            <div className={styles.line_block}>
                <div className={styles.line}></div>
            </div>
            
            <div className={styles.main_space}>
                <div className={styles.space}>
                    <div className={styles.main_input_block}>
                        <div className={styles.input_block}>
                            <input type="text" require onChange={e => setSearchQuery(e.target.value)}  className={styles.input}/>
                            <button className={styles.icon_search_block}>
                                <img src={search_icon} className={styles.icon_search} alt="" />
                            </button>
                        </div>
                        <button className={styles.add_button} onClick={() => setOpen(true)}>
                            <img src={plus_icon} className={styles.plus_icon} alt="" />
                            <span className={styles.add_btn_text}>Добавить</span>
                        </button>
                    </div>
                    
                    <ul className={styles.ul_list}>

                            {materials.length > 0 ? (
                                    materials
                                    .filter((material) =>
                                        material.material_title.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((material) => (
                                        <Link
                                        to={`/disciplines/${disciplineId}/topics/${topicId}/${material.id}`}
                                        key={material.id}
                                        >
                                        <SubscriptionElement
                                            key={material.id}
                                            material_title={material.material_title}
                                        />
                                        </Link>
                                    ))
                                ) : (
                                    <p onClick={() => setOpen(true)} className={styles.warning_message}>Здесь пока ничего нет...</p>
                                )}
                        
                        
                        
                    </ul>
                </div>
            </div>
        </>
    )
}
