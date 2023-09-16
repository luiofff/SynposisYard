import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import AddNewSubject from "../../UI/Cards/AddNewSubject/AddNewSubject";
import styles from "./SubjectsPage.module.css";
import Card from "../../UI/Cards/MainCard/Card";
import search_ico from "./assets/search_icon.svg";
import AnimatedCubsButton from "../../UI/buttons/AnimatedCubsButton/AnimatedCubsButton";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import {updateEditData} from "../../Redux/editDataSlice"


function MainSpace() {

  const [disciplines, setDisciplines] = useState([]);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(true);


  const dispatch = useDispatch();

  const discipline_title = useSelector(state => state.editData.editData);

  const handleChange = (event) => {
    dispatch(updateEditData(event.target.value));
  }

  const NavToggleOpen = () => {
    setOpenModal(!openModal);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const email = token ? JSON.parse(atob(token.split('.')[1])).email : '';
      const body = { discipline_title: `"${discipline_title}"`, email };
      const response = await axios.post('http://localhost:8080/adddiscipline', body);
      setOpenModal(true);
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

      axios
        .get(`http://localhost:8080/user?user_id=${user_id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => setUserName(res.data.username))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <>
      <NavBar
        menu_data_first={'Войти'}
        btn_data={userName}
        btn_data_href={'/disciplines'}
        menu_data_second={'Выйти'}
        menu_data_first_href={"/login"}
        menu_data_second_href={"/"}
      />
      <div className={styles.search_space}>
        <div className={styles.search_block}>
          <input type="text" placeholder='Искать...' className={styles.search_input_field} onChange={e => setSearchQuery(e.target.value)} />
          <div className={styles.search_icon_block}>
            <img src={search_ico} className={styles.search_icon} alt="" />
          </div>
        </div>
        <AnimatedCubsButton />
      </div>
      <div className={`${styles.space}`}>
        <div className={`${styles.add_subject_modal_window} ${!openModal ? styles.add_subject_modal_window_active : ""}`}>
        <div className={`${styles.modal_window_objects}`}>                   
                        <div className={`${styles.input_block}`}>
                            <form onSubmit={onSubmitForm}>
                                <input
                                    type="text" 
                                    placeholder="Название (25 символов)" 
                                    onChange={handleChange}
                                    className={`${styles.input_field}`
                                }/> 
                                <div className={`${styles.under_line}`}></div>
                                <button type='submit' className={styles.add_discipline}>Добавить</button>
                            </form>
                        </div>
                    </div>
        </div>
        {disciplines &&
          disciplines
            .filter((discipline) => discipline.discipline_title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((discipline) => (
              <Link to={`/disciplines/${discipline.id}`} key={discipline.id} className={styles.card_link}>
                <Card discipline_title={(discipline.discipline_title).slice(1, -1)} key={discipline.id} />
              </Link>
            ))}
        <AddNewSubject handleClick={NavToggleOpen} />
      </div>
    </>
  );
}

export default MainSpace;
