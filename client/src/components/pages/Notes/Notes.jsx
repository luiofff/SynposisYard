import React, { useState } from 'react';
import { Table, withTableActions, Modal, Button, TextInput } from '@gravity-ui/uikit';
import NavBar from '../../UI/NavBar/NavBar';
import styles from "./Notes.module.css"
import "./styles.css"
import { useParams} from 'react-router-dom';

const MyTable = withTableActions(Table);

const data = []

const initialData = [...data];

const columns = [
  { id: 'id', label: 'Номер' },
  { id: 'task', label: 'Задача' },
];

function Notes() {
  const [tableData, setTableData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({ id: null, task: '' });
  const [userName, setUserName] = useState('');
  const [disciplineTitle, setDisciplineTitle] = useState('');
  const { disciplineId } = useParams();

  const deleteObjectById = (id) => {
    const updatedData = tableData.filter((item) => item.id !== id);
    setTableData(updatedData);
    const newData = updatedData.map((item, index) => ({
        ...item,
        id: index + 1,
    }));
    setTableData(newData);
  };

  const handleEditClick = () => {
    // Find the index of the selected row based on the id
    const rowIndex = tableData.findIndex(item => item.id === editData.id);

    if (rowIndex !== -1) {
      // Create a copy of the data array and update the task for the selected row
      const updatedData = [...tableData];
      updatedData[rowIndex].task = editData.task;
      setTableData(updatedData);
    }
    setEditData({ id: null, task: '' })
    // Close the modal
    setOpen(false);
  };

  const handleAddClick = () => {
    // Create a new row with a unique id and the task from the input field
    const newRow = {
      id: Math.max(...tableData.map(item => item.id), 0) + 1,
      task: editData.task,
    };

    // Add the new row to the table data
    setTableData([...tableData, newRow]);
    setEditData({ id: null, task: '' })
    // Close the modal
    setOpen(false);
  };

  const getRowActions = (row) => {
    return [
      {
        text: 'Edit',
        handler: () => {
          setEditData({ id: row.id, task: row.task });
          setOpen(true);
        },
      },
      {
        text: 'Remove',
        handler: () => {
          deleteObjectById(row.id);
        },
        theme: 'danger',
      },
    ];
  };

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
  React.useEffect(() => {
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
      <div className={styles.table_space}>
        <MyTable
          className={styles.tableContainer }
          data={tableData}
          columns={columns}
          getRowActions={getRowActions}
        />
      </div>

      <div className={styles.button_space}>
        <div className={styles.button_container}>
          <Button className={styles.btn} onClick={() => setOpen(true)}>Добавить</Button>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div className={styles.modal_window}>
            <TextInput
              onChange={(e) => setEditData({ id: editData.id, task: e.target.value })}
              className={styles.input__block}
              value={editData.task}
              placeholder="Введите новое значение"
              hasClear
            />
            {editData.id ? ( // If editData.id is set, show the "Edit" button
              <Button onClick={handleEditClick} size="xl">
                Edit
              </Button>
            ) : ( // Otherwise, show the "Add" button
              <Button onClick={handleAddClick} size="xl">
                Add
              </Button>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Notes;
