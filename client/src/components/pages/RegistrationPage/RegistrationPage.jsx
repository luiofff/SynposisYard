import React, { useEffect, useState, useRef } from 'react'
import styles from "./RegistrationPage.module.css"
import NavBar from '../../UI/NavBar/NavBar'
import hidden_icon from "./assets/hidden_icon.svg"
import visibility_off from "./assets/visibility_off.svg"
import classNames from 'classnames';


export default function AuthPage() {

    // work with express

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [comfirmPassword, setComfirmPassword] = useState("");

    

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            if (password === comfirmPassword) {
                const body = { username, password, email };
                const response = await fetch("http://localhost:8080/registration", {
                    method: "POST",
                    headers: { "Content-Type" : "application/json" },
                    body: JSON.stringify(body)
                });

                window.location.replace("/");
            }
            else {
                setCheck(true);
            }
            
        } catch (err) {
            console.error(err.message)
        }
    }


    // hide password

    const [hidePassword, setHide] = useState(true);
    const [hidePasswordConfirm, setHideConfirm] = useState(true);
    const [check, setCheck] = useState(false);

    const seePassword = () => {
        setHide(!hidePassword)
    }

    const seePasswordConfirm = () => {
        setHideConfirm(!hidePasswordConfirm)
    }





    return (
        <>
            <NavBar menu_data_first={'Войти'} btn_data={'Войти'} btn_data_href={'/login'} menu_data_first_href={"/login"}/>
            <div className={styles.auth_page}>
                <div className={styles.title_block}>
                    <h1>Регистрация</h1>
                </div>

                <form className={styles.auth_page_form} onSubmit={onSubmitForm}>
                     <div className={styles.input_block}>
                        <input type="text" placeholder='Ваше имя' className={styles.input_field} value={username} onChange={e => setUsername(e.target.value)} required/>
                    </div>
                    <div className={styles.input_block}>
                        <input type="email" placeholder='Email' className={styles.input_field} value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className={!check ? styles.input_block : styles.input_block_false} >
                        <input type={!hidePassword ? "text" : "password"} placeholder='Пароль' className={classNames(styles.input_field)} value={password} onChange={e => setPassword(e.target.value)}/>
                        <div className={styles.function_block} onClick={seePassword}>
                            <img src={!hidePassword ? visibility_off : hidden_icon} alt=""  className={styles.hidden_icon}/>
                        </div>
                    </div>
                    <div className={!check ? styles.input_block : styles.input_block_false}>
                        <input type={!hidePasswordConfirm ? "text" : "password"} placeholder='Подтвердите пароль' className={classNames(styles.input_field)} onChange={e => setComfirmPassword(e.target.value)}/>
                        <div className={styles.function_block} onClick={seePasswordConfirm}>
                            <img src={!hidePasswordConfirm ? visibility_off : hidden_icon} alt=""  className={styles.hidden_icon}/>
                        </div>
                    </div>
                    <button className={styles.submit_button} >Зарегистрироватьcя</button>
                </form>

                


            </div>
        </>
    )
}