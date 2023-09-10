import React from 'react'
import right_arrow_list_element from "./assets/right_arrow_list_element.svg"
import styles from "./SubscriptionElement.module.css"

export default function SubscriptionElement({material_title}) {
  return (
    <>
      <div className={styles.list__element_block}>
        <img src={right_arrow_list_element} className={styles.icon_block} alt="" />
        <div className={styles.text_block}>
            <span className={styles.text_title}>{material_title}</span>
        </div>
      </div>
    </>
  )
}
