import styles from "./AddNewSubject.module.css"
import plus from "./assets/add_FILL0_wght400_GRAD0_opsz48 (1).svg"
import React, { useState } from "react";


function AddNewSubject(props) {
    return (
        <div className={`${styles.card}`} onClick={props.handleClick}>
            <div className={`${styles.ico_block}`}>
                <img src={plus} className={`${styles.icon}`} alt="" />
            </div>
        </div>
    )
}

export default AddNewSubject;