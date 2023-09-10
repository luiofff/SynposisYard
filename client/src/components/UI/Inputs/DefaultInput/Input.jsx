import styles from "./Input.module.css"
import React, { useState } from "react";


function Input(props) {
    

    return (
        <div>
            <div className={`${styles.input_block}`}>
                <input
                    type={props.InputData.type} 
                    placeholder={props.InputData.placeholderName} 
                    className={`${styles.input_field}`
                }/>
                <div className={`${styles.under_line}`}></div>
            </div>
        </div>
    )
}

export default Input;