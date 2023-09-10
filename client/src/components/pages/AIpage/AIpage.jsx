import React, { useState, useEffect } from 'react'
import styles from "./AIpage.module.css"
import NavBar from '../../UI/NavBar/NavBar'
import classNames from 'classnames'
import ai_logo from '../../UI/buttons/AnimatedCubsButton/assets/ai_logo.svg'
import axios from 'axios';

export default function AIpage() {

    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [userName, setUserName] = useState("");
    const [check, setCheck] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Send a request to the server with the prompt
        axios
          .post("http://localhost:8080/chat", { prompt })
          .then((res) => {
            // Update the response state with the server's response
            setResponse(res.data);
            console.log(response);
          })
          .catch((err) => {
            console.error(err);
          });
        setCheck(true);
      };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          const user_id = JSON.parse(atob(token.split('.')[1])).email;
          
    
          axios
            .get(`http://localhost:8080/user?user_id=${user_id}`, {
              headers: {
                Authorization: token,
              },
            })
            .then((res) => setUserName(res.data.username))
            .catch((err) => console.error(err));
        }
    }, []);

    const formattedResponse = response.replace(/(?:\r\n|\r|\n)/g, '\n');

    return (
        <>
            <NavBar
                menu_data_first={'Войти'}
                btn_data={userName}
                btn_data_href={'/disciplines'}
                menu_data_second={'Выйти'}
                menu_data_first_href={"/login"}
                menu_data_second_href={"/"}
            />

            <div className={styles.input_ai_block}>
                <form onSubmit={handleSubmit} className={styles.input_block}>
                    <input type="text" onChange={(e) => setPrompt(e.target.value)} value={prompt} placeholder='Ваш запрос...'  className={styles.input_ai}/>
                    <button type='submit' className={styles.button}>
                        <img src={ai_logo} className={styles.ai_icon} alt="" />
                    </button>
                </form>
            </div>

            <div className={styles.block_with_textarea_reference}>
                <div className={styles.block_with_textarea}>
                    <div className={!check ? styles.user_prompt_block_reference_unactive : styles.user_prompt_block_reference_active}>
                        <div className={classNames(styles.profile_chat_block, styles.profile_chat_block_user)}>
                            Вы
                        </div>
                        <div className={styles.user_prompt_block}>{prompt}</div>
                    </div>
                    <div className={formattedResponse==="" ? styles.response_unactive : styles.response_active}>
                        <div className={classNames(styles.profile_chat_block, styles.profile_chat_block_ai)}>
                            AI
                        </div>
                        <pre>{formattedResponse}</pre>
                    </div>
                    
                </div>
            </div>
            


        </>
    )
}
