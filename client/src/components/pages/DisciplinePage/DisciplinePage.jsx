import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import CardBtn from '../../UI/buttons/CardButton/CardButton';
import styles from './DisciplinePage.module.css';
import AnimatedCubsButton from '../../UI/buttons/AnimatedCubsButton/AnimatedCubsButton';
import axios from 'axios';
import {  useSelector } from 'react-redux'
import classNames from 'classnames';

export default function DisciplinePage() {
  const [userName, setUserName] = useState('');
  const [disciplineTitle, setDisciplineTitle] = useState('');
  const { disciplineId } = useParams();
  const editData = useSelector(state => state.editData.editData)

  const navigate = useNavigate();


  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const user_id = JSON.parse(atob(token.split('.')[1])).email;

      const userResponse = await fetch(`http://localhost:8080/user?user_id=${user_id}`, {
        headers: {
          Authorization: token,
        },
      });
      const userJsonData = await userResponse.json();
      setUserName(userJsonData.username);

      const disciplineResponse = await fetch(`http://localhost:8080/disciplines/${disciplineId}`);
      if (!disciplineResponse.ok) {
        throw new Error('Discipline not found');
      }
      const disciplineJsonData = await disciplineResponse.json();
      console.log(disciplineJsonData.discipline_title);
      
      setDisciplineTitle(disciplineJsonData.discipline_title);

    } catch (error) {
      console.error(error);
      // Handle the error, e.g., set an error state or display an error message to the user
    }
  };

  const editFunc = async () => {
    try {
      console.log(editData)
      const updateDiscipline = await axios.put(`http://localhost:8080/disciplines/${disciplineId}/update`, {
        disciplineTilte: JSON.stringify(editData)
      });

      
    } catch (err) {
      console.error(err.message);
    }
    
  }

  const deleteFunc = async () => {
    try {
      const deleteDiscipline = await fetch(`http://localhost:8080/disciplines/${disciplineId}`, {
        method: "DELETE"
      });

      navigate("/disciplines");
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [disciplineId]);

  return (
    <>
      <NavBar
        menu_data_first="Войти"
        btn_data={userName}
        btn_data_href="/login"
        menu_data_second="Регистрация"
        menu_data_first_href="/login"
        menu_data_second_href="/registration"
      />
      <div className={styles.settings_block}>
        <div className={styles.settings_block_container}>
          <div className={styles.nav_blocks}>
            <CardBtn  disciplineId={disciplineId} deleteFunc={deleteFunc} editFunc={editFunc}/>
            
          </div>
          <div className={styles.nav_title}>
            <h1 className={classNames(styles.title, styles.text_of_title)}>{disciplineTitle.slice(1, -1)}</h1>
          </div>
        </div>
      </div>
      <div className={styles.card_space}>
          <Link to={`topics`} className={styles.card}>
            <div className={styles.title_block}>
              <h1 className={styles.card__title}>Темы</h1>
            </div>
          </Link>
       

        <div className={styles.card}>
          <div className={styles.title_block}>
            <h1 className={styles.card__title}>Заметки</h1>
          </div>
        </div>
      </div>
    </>
  );
}
