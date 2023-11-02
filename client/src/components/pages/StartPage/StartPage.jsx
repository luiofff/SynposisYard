import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import animationLogo from "../../UI/NavBar/assets/logo.json"
import lottie from "lottie-web";


// components
import NavBar from '../../UI/NavBar/NavBar'
import RelocateButton from '../../UI/buttons/Relocate_button/RelocateButton'

// styles
import styles from "./StartPage.module.css"

// assets
import arrow_down from "./assets/arrow_down.svg"
import ai_icon from "./assets/AI_icon.svg"
import book_ico from "./assets/Book_ico.svg"


export default function StartPage() {
    


    useEffect(() => {;
        lottie.loadAnimation({
          container: document.querySelector("#logo"),
          animationData: animationLogo,
          renderer: "svg", // "canvas", "html"
          loop: false, // boolean
          autoplay: true, // boolean
        });
      }, []);

    return (
    <>
        <header className={styles.primary_header}>
            <div className={styles.navblock}>
                <div id='logo' className={styles.logo}></div>
            </div>
            <div className={styles.navblock}>
                <a className={styles.nav_btn} href="/login">Войти</a>
            </div>
        </header>
        <div className={styles.title_page}>
            <div className={styles.text_button_block}>
                <div className={styles.text_block}>
                    <span className={styles.title_text}>УЧИСЬ</span>
                    <span className={styles.title_text}>СОЗДАВАЙ</span>
                    <span className={styles.title_text}>ОТКРЫВАЙ</span>
                </div>
                <div className={styles.button_block}>
                    <RelocateButton text={'Поехали'} href={'/registration'}/>
                </div>
            </div>
            
            <a href="#second" className={styles.next_content_block}> 
                <div className={styles.next_content_button}>Подробнее</div>
                <div className={styles.arrow_block}>
                    <img src={arrow_down} className={styles.arrow_down} alt="" />
                </div>
            </a>
        </div>
        <div className={styles.page_about} id='second'>
            <div className={styles.part_content}>
                <div className={styles.logo_block}>
                    <img src={ai_icon} alt="" className={styles.icon}/>
                </div>
                <div className={styles.text_block_second_content}>
                    Вы можете использовать искусственный интелект для: <br/><br/>- оптимизации вашего материала
                    <br/><br/>- Создания уникальных тестов
                    <br/><br/>- Решения вопросов
                </div>
            </div>
            <div className={styles.part_content}>
                
                <div className={styles.text_block_second_content}>
                    Вы можете: <br/><br/>-  Добавлять материалы
                    <br/><br/>- Делать заметки
                    <br/><br/>- Структурировать конспекты
                </div>
                <div className={styles.icon_block}>
                    <img src={book_ico} alt="" className={styles.icon}/>
                </div>
            </div>
        </div>
    </>
  )
}