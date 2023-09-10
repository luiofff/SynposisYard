import React, { useEffect } from 'react'
import styles from "./AnimatedCubsButton.module.css"
import classNames from 'classnames'
import ai_logo from './assets/ai_logo.svg'

export default function DisciplinePage() {


    

    return (
        <>
            <ul className={styles.ul}>
                <li className={styles.li}>
                <a href="/AIpage">
                    <span className={styles.span}><img src={ai_logo} alt="" className={styles.ai_logo_second} /></span>
                    <span className={styles.span}><img src={ai_logo} alt="" className={styles.ai_logo_second} /></span>
                    <span className={styles.span}><img src={ai_logo} alt="" className={styles.ai_logo_second} /></span>
                    <span className={classNames(styles.span, styles.f_logo)}>
                        <img src={ai_logo} alt="" className={classNames(styles.ai_logo_second, styles.front_logo)} />
                        <div className={styles.content}>
                            <h2>AI</h2>
                            <h2>AI</h2>
                        </div>
                    </span>
                    <span className={classNames(styles.fab, styles.fa_css3_alt)}>
                    </span>
                    
                </a>

                </li>
            </ul>

            
        </>
    )
}