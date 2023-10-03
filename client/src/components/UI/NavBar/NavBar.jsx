import React, { useState, useEffect } from 'react'
import styles from "./NavBar.module.css"
import classNames from 'classnames'
import logo from "./assets/logo.svg"
import animationLogo from "./assets/logo.json"
import close from "./assets/close_FILL0_wght400_GRAD0_opsz48.svg"
import axios from 'axios'
import AnimatedCubsButton from "../../UI/buttons/AnimatedCubsButton/AnimatedCubsButton";
import { Link } from 'react-router-dom';
import lottie from "lottie-web";



function NavBar({check, btn_data, btn_data_href, menu_data_first, menu_data_second, menu_data_first_href, menu_data_second_href}) {
    const [hamburgerOpen, setHamburgerOpen] = useState(true)


    const toggleOpen = () => {
        setHamburgerOpen(!hamburgerOpen)
    }

    const handleLogout = async () => {
        try {
          await axios.get('http://localhost:8080/logout');
        } catch (error) {
          console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
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
               <nav className={classNames(styles.navbar)}>
                    <div className={styles.nav_block}>
                        <div className={styles.menu_open_block} onClick={toggleOpen}>
                            <div className={styles.stick}></div>
                            <div className={styles.stick}></div>
                            <div className={styles.stick}></div>
                        </div>
                    </div>
                    
                    <div className={styles.nav_block}>
                        <div className={styles.logo_block}>
                            <div id='logo' className={styles.logo}></div>
                        </div>
                    </div>

                    <div className={styles.nav_block}>
                        <a href={btn_data_href}>
                            <div className={styles.nav_button}>
                                {btn_data}
                            </div>
                        </a> 
                    </div>
                    
                            
               </nav>
            </header>
            <div className={`${styles["menu_block"]} ${!hamburgerOpen ? styles.active : ""}` }>
                <nav className={styles.menu_nav}>
                    <img src={close} alt="" className={styles.close_icon} onClick={toggleOpen}/>
                </nav>
                <div className={styles.text_block}>
                    <span className={styles.title_text}>SYproject</span>
                    <a href={menu_data_first_href} className={styles.menu_text}>{menu_data_first}</a>
                    <a href={menu_data_second_href} className={styles.menu_text} onClick={!check ? handleLogout : () => {}}>{menu_data_second}</a>
                </div>
            </div>
        </>
    )
}

export default NavBar;