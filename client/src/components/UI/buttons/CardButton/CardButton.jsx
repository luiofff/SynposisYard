import React, { useEffect, useState } from "react";
import styles from './CardButton.module.css';
import animationEdit from "./assets/animations/edit.json"
import animationTrash from "./assets/animations/trash.json"
import lottie from "lottie-web";
import classNames from "classnames";
import { useDispatch, useSelector } from 'react-redux'
import {updateEditData} from "../../../Redux/editDataSlice"
import {Tooltip} from '@gravity-ui/uikit';

function CardBtn({ deleteFunc, editFunc, pre_title, title, full_title }) {
  const dispatch = useDispatch();

  const editData = useSelector(state => state.editData.editData);

  const handleChange = (event) => {
    console.log(editData)
    dispatch(updateEditData(event.target.value));
  }

  



  useEffect(() => {
    // trash icon settings
    const animationContainerTrash = document.querySelector("#trash");
    const animationInstanceTrash = lottie.loadAnimation({
      container: animationContainerTrash,
      animationData: animationTrash,
      loop: false,
      default: false
    });
    animationInstanceTrash.stop();
    animationContainerTrash.addEventListener("mouseenter", () => {
      animationInstanceTrash.play();
    });
    animationContainerTrash.addEventListener("mouseleave", () => {
      animationInstanceTrash.stop();
    });

    // edit icon settings

    const animationContainerEdit = document.querySelector("#edit");
    const animationInstanceEdit = lottie.loadAnimation({
      container: animationContainerEdit,
      animationData: animationEdit,
      loop: false,
      default: false
    });
    animationInstanceEdit.stop();
    animationContainerEdit.addEventListener("mouseenter", () => {
      animationInstanceEdit.play();
    });
    animationContainerEdit.addEventListener("mouseleave", () => {
      animationInstanceEdit.stop();
    });

  }, [animationTrash]);


  return (
    <>
      <div className={styles.main_space}>
        <div className={styles.content}>

          <div className={styles.ui_components__block}>
            <div className={styles.icons_block}>

              <div className={classNames(styles.icon_block, styles.icon_trash)}>
                <div id="trash" onClick={deleteFunc} className={styles.icon}></div>         
              </div>

              <div className={styles.edit__icon}>
                <div className={styles.icon_input}>
                  <div className={classNames(styles.icon_block, styles.icon_edit,)}>
                    <div  onClick={editFunc} id="edit" className={styles.icon}></div>
                  </div>

                  <input 
                    type="text"  
                    className={styles.edit_block_input} 
                    onChange={handleChange}   
                    placeholder="Название" 
                  />
                </div>

                <div className={styles.input__line}></div>
              </div>
              

            </div>
          </div>

          <div className={styles.text__block}>
            <div className={classNames(styles.pre__title, styles.text)}>{ pre_title }</div>
            <Tooltip placement="top" content={full_title.slice(1, -1)}>
              <div  className={classNames(styles.__title, styles.text)}>{ title }</div>
            </Tooltip>
          </div>

        </div>
      </div>
    </>
  )
}

export default CardBtn;