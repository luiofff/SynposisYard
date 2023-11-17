import React, {useState} from 'react';
import NavBar from '../../UI/NavBar/NavBar';
import styles from "./Notes.module.css";
import animationTrash from "../../UI/buttons/CardButton/assets/animations/trash.json";
import lottie from "lottie-web";
import { useParams } from 'react-router-dom';



import {Button, Modal} from '@gravity-ui/uikit';

import axios from 'axios';

export default function Notes() {
  const { disciplineId } = useParams();
  const [note, setNote] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedSecondaryChecks, setSelectedSecondaryChecks] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleAllCheckedChange = () => {
    setSelectAllChecked(!selectAllChecked);
    setSelectedSecondaryChecks(selectAllChecked ? [] : note.map((a) => a)); // Toggle selection
  };

  const handleSecondaryCheckChange = (noteId) => {
    const updatedSelection = selectedSecondaryChecks.includes(noteId)
      ? selectedSecondaryChecks.filter((id) => id !== noteId)
      : [...selectedSecondaryChecks, noteId];
    setSelectedSecondaryChecks(updatedSelection);
    console.log(selectedSecondaryChecks)
    console.log(noteId)
  }; 

  const updateWithDelete = async () => {
    try {
      const originalArray = note;
      const elementsToRemove = selectedSecondaryChecks;
  
      const newArray = originalArray.filter(element => !elementsToRemove.includes(element));

      const response = await axios.post(`http://localhost:8080/disciplines/${disciplineId}/addOrUpdateNote`, {
        discipline_id: disciplineId,
        note: newArray,
      });

      const { action, result } = response.data;

      if (action === 'insert') {
        console.log('Note inserted successfully:', result);
      } else if (action === 'update') {
        console.log('Note updated successfully:', result);
      }
      window.location.reload();
    } catch (error) {
      console.error('Error adding or updating note:', error.response.data.error);
    }
  }
  
  const addOrUpdateNote = async () => {
    try {
      note.push(newNote);
      const response = await axios.post(`http://localhost:8080/disciplines/${disciplineId}/addOrUpdateNote`, {
        discipline_id: disciplineId,
        note: note
      });

     
        const { action, result } = response.data;

        if (action === 'insert') {
          console.log('Note inserted successfully:', result);
        } else if (action === 'update') {
          console.log('Note updated successfully:', result);
        }
        window.location.reload();
      
      
    } catch (error) {
      console.error('Error adding or updating note:', error.response.data.error);
    }
  };

  const getNotes = async () => {
    try {

      const response = await fetch(`http://localhost:8080/disciplines/${disciplineId}/getNotes`);
      const data = await response.json();
      setNote(data[0])
      console.log(data[0])
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const firstAdd = async () => {
    console.log('asd')
    const response = await axios.post(`http://localhost:8080/disciplines/${disciplineId}/addOrUpdateNote`, {
        discipline_id: disciplineId,
        note: []
    });
  } 



  React.useEffect(() => {

    const fetchData = async () => {
      await getNotes(); 
      if (!note || note.length === 0) {
        firstAdd(); 
      }
    }
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

  }, [animationTrash]);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={styles.modal}>
          <div className={styles.modal_head}>
            <svg onClick={() => setOpen(false)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_21_2)">
              <path d="M10.5858 13.0001L6.34315 8.75744L7.75736 7.34323L12 11.5859L16.2426 7.34323L17.6569 8.75744L13.4142 13.0001L17.6569 17.2427L16.2426 18.6569L12 14.4143L7.75736 18.6569L6.34315 17.2427L10.5858 13.0001Z" fill="#8000FF"/>
              <circle cx="16.9497" cy="8.0502" r="1" transform="rotate(45 16.9497 8.0502)" fill="#8000FF"/>
              <circle cx="16.9497" cy="17.9496" r="1" transform="rotate(45 16.9497 17.9496)" fill="#8000FF"/>
              <circle cx="7.05029" cy="8.0502" r="1" transform="rotate(45 7.05029 8.0502)" fill="#8000FF"/>
              <circle cx="7.05029" cy="17.9496" r="1" transform="rotate(45 7.05029 17.9496)" fill="#8000FF"/>
              </g>
              <defs>
              <clipPath id="clip0_21_2">
              <rect width="24" height="24" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </div>
          <div className={styles.input_block}>
            <input className={styles.input} onChange={(e) => setNewNote(e.target.value)} type="text" name="" id="" />
            <button onClick={addOrUpdateNote} className={styles.modal_btn}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 9H1L1 7H7V1H9V7L15 7V9H9V15H7L7 9Z" fill="white"/>
                <circle cx="8" cy="1" r="1" fill="white"/>
                <circle cx="15" cy="8" r="1" fill="white"/>
                <circle cx="1" cy="8" r="1" fill="white"/>
                <circle cx="8" cy="15" r="1" fill="white"/>
              </svg>

            </button>
          </div>
        </div>
      </Modal>


      <NavBar/>
      <div className={styles.title_block}>
        <h1 className={styles.title_text}>Заметки</h1>
      </div>

      

      <div className={styles.tasks_space}>
        <div className={styles.list_nav_block}>
          <input 
            id="allChecked" 
            type="checkbox" 
            name="allChecked" 
            checked={selectAllChecked}
            onChange={handleAllCheckedChange}
          />

          <div id='trash' className={styles.trash_ico} onClick={updateWithDelete}></div>
          <button className={styles.button_block} onClick={() => setOpen(true)}>
              <span className={styles.btn_title}>Добавить</span>
          </button>
          
        </div>

        { 
          note.map((a) => (
            <div className={styles.task_block} key={a}>
              <input 
                id={`secondaryCheck_${a}`} 
                type="checkbox" 
                className={styles.checkbox} name={a}
                checked={selectedSecondaryChecks.includes(a)}
                onChange={() => handleSecondaryCheckChange(a)}
              />
              <label className={styles.checkbox_title} >{a}</label>
            </div>
          ))
        }

        
      </div>
    </>
  )
}

