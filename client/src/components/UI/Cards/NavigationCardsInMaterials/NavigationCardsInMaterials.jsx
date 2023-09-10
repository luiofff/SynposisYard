import styles from "./NavigationCardsInMaterials.module.css"
import React, { useState } from "react";


function NavigationCardsInMaterials({card_title}) {


  



  return (
    <>
       <div className={styles.card}>
            <div className={styles.title_block}>
                <span className={styles.card_title}>Добавить</span>
            </div>
       </div>
    </>
  )
}

export default NavigationCardsInMaterials;