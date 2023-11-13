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
  }; 

  const handleAddNote = async () => {
    try {
      
     
        note.push(newNote)
        const response = await fetch(`http://localhost:8080/disciplines/${disciplineId}/updateNote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ note: [note], disciplineId }),
        });
        setNewNote("");
      
    } catch (error) {
      console.error('Error adding note:', error.message);
    }
  };

  const getNotes = async () => {
    try {

      const response = await fetch(`http://localhost:8080/disciplines/${disciplineId}/getNotes`);
      const data = await response.json();
      setNote(data)
      return data;
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };


  React.useEffect(() => {

  
    
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
          <div className={styles.input_block}>
            <input className={styles.input} onChange={(e) => setNewNote(e.target.value)} type="text" name="" id="" />
            <button onClick={handleAddNote} className={styles.modal_btn}>a</button>
          </div>
        </div>
      </Modal>


      <NavBar/>
      <div className={styles.title_block}>
        <h1 className={styles.title_text}>Заметики</h1>
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

          <div id='trash' className={styles.trash_ico}></div>
        </div>

        {
          note.map((a) => (
            <div className={styles.task_block}>
              <input 
                id={`secondaryCheck_${a}`} 
                type="checkbox" 
                className={styles.checkbox} name={a}
                checked={selectedSecondaryChecks.includes(a)}
                onChange={() => handleSecondaryCheckChange(a)}
              />
              <label className={styles.checkbox_title} for={a}>{a}</label>
            </div>
          ))
        }
        <Button onClick={() => setOpen(true)}>Добавить</Button>

        
      </div>
    </>
  )
}

