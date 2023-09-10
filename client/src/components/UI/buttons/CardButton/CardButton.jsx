import React, { useEffect } from "react";
import styles from './CardButton.module.css';
import animationEdit from "./assets/animations/edit.json"
import animationTrash from "./assets/animations/trash.json"
import lottie from "lottie-web";
import { useDispatch, useSelector } from 'react-redux'
import {updateEditData} from "../../../Redux/editDataSlice"

function CardBtn({ deleteFunc, editFunc }) {
  
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
      <div className={styles.buttons_block}>
        <div id="trash" onClick={deleteFunc} className={`${styles.icon} ${styles.icon_more}`}></div>
        
        <div className={styles.edit_block_reference}>
            <div className={styles.edit_logo_block}>
              <div id="edit" onClick={editFunc} className={`${styles.icon_edit}`}></div>
            </div>
            
            <input type="text"  className={styles.edit_block_input} onChange={handleChange}   placeholder="Название (25 символов)" />
        </div>
      </div>
    </>
  )
}

export default CardBtn;