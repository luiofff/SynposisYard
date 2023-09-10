import React from 'react'
import styles from "../Relocate_button/RelocateButton.module.css"
import { Link, useNavigate } from "react-router-dom";

export default function RelocateButton({text, href}) {



    return (
        <>  
            <a href={href}>
            <button className={styles.button}>
                    <span className={styles.btnText}>{text}</span>
                </button>
            </a>
        </>
    )
}
