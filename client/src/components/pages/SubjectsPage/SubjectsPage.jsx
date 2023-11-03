import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import AddNewSubject from "../../UI/Cards/AddNewSubject/AddNewSubject";
import styles from "./SubjectsPage.module.css";
import Card from "../../UI/Cards/MainCard/Card";
import search_ico from "./assets/search_icon.svg";
import axios from 'axios';
import {Modal} from '@gravity-ui/uikit';


function MainSpace() {


  const [disciplines, setDisciplines] = useState([]);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = React.useState(false);
  const [discipline_title, setDisciplineTitle] = useState("");


  const handleRefresh = () => {
    window.location.reload(); 
  };


  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const email = token ? JSON.parse(atob(token.split('.')[1])).email : '';
      const body = { discipline_title: `"${discipline_title}"`, email };
      const response = await axios.post('http://localhost:8080/adddiscipline', body);
      handleRefresh();
    } catch (err) {
      console.error(err.message);
    }
  };
  

  


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user_id = JSON.parse(atob(token.split('.')[1])).email;
      axios
      .get(`http://localhost:8080/disciplines?user_id=${user_id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => setDisciplines((res.data)))
      .catch((err) => console.error(err));

    }
  }, []);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <form onSubmit={onSubmitForm} className={styles.modal_window}>
          <div className={styles.input_block}>
            <input type="text"
              onChange={(e) => setDisciplineTitle(e.target.value)}
              className={styles.input}
              placeholder='Название...'
            />
          </div>
          <button type="submit" className={styles.add_btn} onClick={() => setOpen(false)}>
            Добавить
          </button>
        </form>
      </Modal>
      <NavBar/>
      <div className={styles.search_space}>
        <div className={styles.search_block}>
          <input type="text" placeholder='Искать...' className={styles.search_input_field} onChange={e => setSearchQuery(e.target.value)} />
          <div className={styles.search_icon_block}>
            <img src={search_ico} className={styles.search_icon} alt="" />
          </div>
        </div>
      </div>
      <div className={`${styles.space}`}>
        {disciplines &&
          disciplines
            .filter((discipline) => discipline.discipline_title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((discipline) => (
              <Link to={`/disciplines/${discipline.id}`} key={discipline.id} className={styles.card_link}>
                <Card discipline_title={(discipline.discipline_title).slice(1, -1)} key={discipline.id} />
              </Link>
        ))}
        <div onClick={() => setOpen(true)}>
          <AddNewSubject />
        </div>
      </div>
    </>
  );
}

export default MainSpace;
