import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import classNames from 'classnames';
import plus_icon from "./assets/add_topic_icon.svg"
import search_icon from "../SubjectsPage/assets/search_icon.svg";
import styles from "./TopicsPage.module.css"
import AnimatedCubsButton from '../../UI/buttons/AnimatedCubsButton/AnimatedCubsButton';
import SubscriptionElement from '../../UI/buttons/SubscriptionElement/SubscriptionElement';
import close from "./assets/cancel_FILL0_wght400_GRAD0_opsz48.svg"
import axios from "axios"


export default function TopicsPage() {

    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState('');
    const { disciplineId } = useParams();
    const [disciplineTitle, setDisciplineTitle] = useState('');
    const [modalOpen, setmodalOpen] = useState(true);
    const [topics, setTopics] = useState([]);
    const [topic_title , setTopic_title ] = useState("");


    const toggleOpen = () => {
        setmodalOpen(!modalOpen)
    }

    const onSubmitForm = async (e) => {
        
        e.preventDefault();
        try {
          const body = { topic_title: `"${topic_title}"` };
          const response = await fetch(`http://localhost:8080/disciplines/${disciplineId}/addtopics`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          setTopic_title("");
          setmodalOpen(!modalOpen)
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

        const disciplineResponse = await fetch(`http://localhost:8080/disciplines/${disciplineId}`);
        if (!disciplineResponse.ok) {
            throw new Error('Discipline not found');
        }
        const disciplineJsonData = await disciplineResponse.json();
        setDisciplineTitle(disciplineJsonData.discipline_title);

    
        
        axios.get(`http://localhost:8080/disciplines/${disciplineId}/topics`, {
            headers: {
                Authorization: token,
            },
        })
        .then((res) =>  setTopics(res.data))
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
        <>
            <NavBar
                menu_data_first="Войти"
                btn_data={userName}
                btn_data_href="/login"
                menu_data_second="Регистрация"
                menu_data_first_href="/login"
                menu_data_second_href="/registration"
            />

            <div className={styles.navigation_space_block}>
                <div className={styles.navigation_space}>
                    <AnimatedCubsButton />

                    <div className={styles.title__block}>
                        <div className={styles.text_block}>
                            <span className={classNames(styles.text, styles.staic_text)}>Темы по дисциплине</span>
                        </div>
                        <div className={styles.text_block}>
                            <h1 className={classNames(styles.text, styles.main_title)}>{(disciplineTitle).slice(1, -1)}</h1>
                        </div>
                    </div>
                </div>
            </div>

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
                        <button className={styles.add_button} onClick={toggleOpen}>
                            <img src={plus_icon} className={styles.plus_icon} alt="" />
                            <span className={styles.add_btn_text}>Добавить</span>
                        </button>
                    </div>
                    
                    <ul className={styles.ul_list}>
                        
                        {topics &&
                            topics
                            .filter((topic) => topic.topic_title.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((topic) => (
                                <Link to={`/disciplines/${disciplineId}/topics/${topic.id}`}>
                                    <SubscriptionElement key={topic.id} material_title={(topic.topic_title).slice(1, -1)}/>
                                </Link>   
                        ))}
                        
                    </ul>
                </div>


                <div className={`${styles["dialog_window_back"]} ${!modalOpen ? styles.active : ""}`}>
                        <div className={styles.modal_navbar}>
                            <img src={close} onClick={toggleOpen} className={styles.close_icon} alt="" />
                        </div>
                        <form onSubmit={onSubmitForm} className={styles.input_block}>
                                <input type="text" onChange={e => setTopic_title(e.target.value)} placeholder="Название (макс. 25 символов)" value={topic_title}  className={styles.input}/>
                                <button type='submit' className={styles.icon_search_block}>
                                    <img src={plus_icon} className={styles.icon_search} alt="" />
                                </button>

                        </form>
                </div>
            </div>

        </>
    )
}
