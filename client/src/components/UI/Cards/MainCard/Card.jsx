import styles from "./Card.module.css"
import CardButton from "../../buttons/CardButton/CardButton";
import React, { useState } from "react";


function Card({discipline_title}) {
    return (
        <>
           
                <div className={`${styles.card}`}>
                    <div className={styles.text_block}>
                        <div className={`${styles.title_text}`}>{discipline_title}</div>
                    </div>
                    
                </div>
            
        </>
    )
}

export default Card;