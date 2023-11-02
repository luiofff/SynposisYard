import React, { useState, useEffect } from 'react'
import styles from "./LoginPage.module.css"
import NavBar from '../../UI/NavBar/NavBar'
import hidden_icon from "./assets/hidden_icon.svg"
import visibility_off from "./assets/visibility_off.svg"
import classNames from 'classnames';
import animationLogo from "../../UI/NavBar/assets/logo.json"
import lottie from "lottie-web";



export default function AuthPage() {

    // work with express

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [check, setCheck] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const body = { email, password };
        // Send a request to the server to check authorization data
        const response = fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
                console.log(response)
                console.log(JSON.stringify(body))
                setCheck(true);
            }
        })

        .then((data) => {
            // Saving a JWT token in local storage
            localStorage.setItem('token', data.token);
            window.location.replace("/disciplines");
        
        })

        .catch((error) => {
            console.error(error);
        });
    };


    // hide password

    const [hidePassword, setHide] = useState(true);

    const seePassword = () => {
        setHide(!hidePassword)
    }


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
                    <a className={styles.nav_btn} href="/registration">Регистрация</a>
                </div>
            </header>
            <div className={styles.auth_page}>
                <div className={styles.title_block}>
                    <h1>Вход</h1>
                </div>

                <form className={styles.auth_page_form} onSubmit={handleSubmit}>
                    <div className={!check ? styles.input_block : styles.input_block_false}>
                        <input type="email" placeholder='Email' className={styles.input_field} value={email} onChange={handleEmailChange}/>
                    </div>
                    <div className={!check ? styles.input_block : styles.input_block_false} >
                        <input type={!hidePassword ? "text" : "password"} placeholder='Пароль' className={classNames(styles.input_field)} value={password} onChange={handlePasswordChange}/>
                        <div className={styles.function_block} onClick={seePassword}>
                            <img src={!hidePassword ? visibility_off : hidden_icon} alt=""  className={styles.hidden_icon}/>
                        </div>
                    </div>
                    <button className={styles.submit_button} type='submit'>Войти</button>
                </form>

            </div>
        </>
    )
}

