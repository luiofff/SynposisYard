import React, { useState, useEffect } from 'react'
import styles from "./NavBar.module.css"
import animationLogo from "./assets/logo.json"
import axios from 'axios'
import lottie from "lottie-web";
import {DropdownMenu} from '@gravity-ui/uikit';



function NavBar() {
    const [userName, setUserName] = useState('');

    const handleLogout = async () => {
        try {
          await axios.get('http://localhost:8080/logout');
          
        } catch (error) {
          console.error('Error logging out:', error);
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
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        fetchData();

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
                <div className={styles.navbar_block}>
                    <div id='logo'  className={styles.logo}></div>
                </div>
                <div className={styles.navbar_block}>
                    <DropdownMenu
                        switcher={
                            <div className={styles.username}>
                                {userName}
                            </div>
                        }
                        items={[
                            {
                                action: () => console.log('Rename'),
                                text: 'Дисциплины',
                            },
                            {
                                action: () => handleLogout(),
                                text: 'Выйти'
                            },
                        ]}
                    />
                </div>
            </header>
        </>
    )
}

export default NavBar;