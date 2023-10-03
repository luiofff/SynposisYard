import React, { useState, useEffect, useContext, createContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import classNames from 'classnames';
import plus_icon from "../TopicsPage/assets/add_topic_icon.svg"
import search_icon from "../SubjectsPage/assets/search_icon.svg";
import styles from "./MaterialsPage.module.css"
import AnimatedCubsButton from '../../UI/buttons/AnimatedCubsButton/AnimatedCubsButton';
import SubscriptionElement from '../../UI/buttons/SubscriptionElement/SubscriptionElement';
import close from "../TopicsPage/assets/cancel_FILL0_wght400_GRAD0_opsz48.svg"
import axios from "axios"
import CardBtn from '../../UI/buttons/CardButton/CardButton';
import {  useSelector } from 'react-redux'


const SearchQueryContext = createContext();
const OpenModalContext = createContext();

const PageActions = () => {
    const [searchQuery, setSearchQuery] = useContext(SearchQueryContext);
    const [modalOpen, setmodalOpen] = useContext(OpenModalContext);

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value); 
    };

    const handeleOpen = () => {
        setmodalOpen(!modalOpen)
    }

    return (
        <>
            <div className={styles.main_input_block}>
                <div className={styles.input_block}>

                    <input 
                        type="text" 
                        onChange={handleSearchInputChange}  
                        className={styles.input}
                    />

                    <button className={styles.icon_search_block}>
                        <img src={search_icon} className={styles.icon_search} alt="" />
                    </button>
                </div>
                <button className={styles.add_button} onClick={handeleOpen}>
                    <img src={plus_icon} className={styles.plus_icon} alt="" />
                    <span className={styles.add_btn_text}>Добавить</span>
                </button>
            </div>
        </>
    );
}

export default function TopicsPage() {

    const [userName, setUserName] = useState('');
    const { disciplineId, topicId } = useParams();
    const [topic_title , setTopicTitle] = useState("");
    const [materials, setMaterials] = useState([]);
    const [material_title, setMaterial_title] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(true); 

    // functions for delete and edit buttons

    const editData = useSelector(state => state.editData.editData)

    const deleteFunc = async () => {
        try {
          const deleteDiscipline = await fetch(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/deleteTitle`, {
            method: "DELETE"
          });
        } catch (err) {
          console.error(err.message);
        }
    }

    const editFunc = async () => {
        try {
          console.log(editData)
          const updateDiscipline = await axios.put(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/updateTitle`, {
            topic_title: JSON.stringify(editData)
          });
    
          
        } catch (err) {
          console.error(err.message);
        }
      }

    // ________________________________________

    const handleModalToggle = () => {
        setModalOpen(!modalOpen);
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
          const content = `"${material_title}"`
          const body = { material_title: content };
          const response = await fetch(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/addmaterial`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          setMaterial_title("");
          setModalOpen(!modalOpen)
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
        setTopicTitle(getTopicTitleJson.topic_title)

     

        axios.get(`http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}`, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) =>  setMaterials(res.data))
        .catch((err) => console.error(err));


        } catch (error) {
        console.error(error);
        // Handle the error, e.g., set an error state or display an error message to the user
        }
    };

    useEffect(() => {
        fetchData();
    }, [disciplineId]);

    return (
        <SearchQueryContext.Provider value={[searchQuery, setSearchQuery]}>
            <OpenModalContext.Provider value={[modalOpen, handleModalToggle]}>
                <>
                    <NavBar
                        menu_data_first="Войти"
                        btn_data={userName}
                        btn_data_href="/login"
                        menu_data_second="Регистрация"
                        menu_data_first_href="/login"
                        menu_data_second_href="/registration"
                    />

                    
                    <CardBtn deleteFunc={deleteFunc} editFunc={editFunc} pre_title={'Материалы по теме'} title={(topic_title).slice(1, -1)}/>
                    

                    <div className={styles.line_block}>
                        <div className={styles.line}></div>
                    </div>
                    
                    <div className={styles.main_space}>
                        <div className={styles.space}>

                            <PageActions />
                            
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
                                    <p onClick={handleModalToggle} className={styles.warning_message}>Здесь пока ничего нет...</p>
                                )}
                            </ul>
                        </div>


                        <div className={`${styles["dialog_window_back"]} ${!modalOpen ? styles.active : ""}`}>
                                <div className={styles.modal_navbar}>
                                    <img src={close} onClick={handleModalToggle} className={styles.close_icon} alt="" />
                                </div>
                                <form onSubmit={onSubmitForm} className={styles.input_block}>
                                        <input type="text" onChange={e => setMaterial_title(e.target.value)} placeholder="Название (макс. 25 символов)" value={material_title}  className={styles.input}/>
                                        <button type='submit' className={styles.icon_search_block}>
                                            <img src={plus_icon} className={styles.icon_search} alt="" />
                                        </button>
                                </form>
                        </div>
                    </div>

                </>
            </OpenModalContext.Provider>
        </SearchQueryContext.Provider>
    )
}
