import React, { useState } from 'react';
import styles from "./AddModal.module.css";
import close from "../assets/close.json";
import lottie from "lottie-web";
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../../Redux/modalSlice';
import axios from 'axios';

export default function AddModal({ topicId, materialId, disciplineId }) {


  const dispatch = useDispatch();

  const modal_state = useSelector(state => state.modal.modalOpen);

  const [active, setActive] = React.useState(2);
  const [close_modal, setClose] = React.useState(true);
  const [material, setMaterial] = React.useState("");
  const [file, setFile] = useState(null); // State to store the selected file

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.put(
        `http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/${materialId}/uploadFile`,
        formData
      );

      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadFileToServer(selectedFile);
    }
  };

  const toggleClose = () => {
    setClose(!close_modal);
  }

  const toggleSwitch = () => {
    if (active === 1) {
      setActive(2);
    } else {
      setActive(1);
    }
  }

  const handleSaveClick = async () => {
    try {
      const updateDiscipline = await axios.put(
        `http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/${materialId}/updateMaterialData`,
        {
          material_data: material,
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  React.useEffect(() => {
    // folder animation settings
    const animationContainerFolder = document.querySelector("#close_icon");
    const animationInstanceFolder = lottie.loadAnimation({
      container: animationContainerFolder,
      animationData: close,
      loop: false,
      default: false
    });
    animationInstanceFolder.stop();
    animationContainerFolder.addEventListener("mouseenter", () => {
      animationInstanceFolder.play();
    });
    animationContainerFolder.addEventListener("mouseleave", () => {
      animationInstanceFolder.stop();
    });

  }, []);

  return (
    <>
      <div className={styles.modal_background}></div>
      <div className={styles.modal_refernce}>
        <div className={styles.container}>
          <div className={styles.close_reference_block}>
            <div onClick={() => dispatch(closeModal())} id='close_icon' className={styles.close_icon}></div>
          </div>
          <div className={styles.header}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">
              <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> <p>Browse File to upload!</p>
          </div>
          <label htmlFor="fileInput" className={styles.footer}>
            <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g></svg>
            <p>{file ? file.name : 'Not selected file'}</p>
            <input
              onChange={handleFileChange}
              className={styles.file_input_hidden}
              type="file"
              id="fileInput"
              style={{ display: "none" }}
            />
          </label>
          <button onClick={uploadFileToServer}>upload</button>
        </div>
      </div>
    </>
  )
}
