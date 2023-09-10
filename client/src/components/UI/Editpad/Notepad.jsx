import React, { useState, useEffect } from 'react';
import { getDocument } from 'pdfjs-dist';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import axios from "axios"
import styles from "./Notepad.module.css"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import draftToHtml from 'draftjs-to-html';
import html2pdf from 'html2pdf.js';




pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Notepad({topicId, materialId, disciplineId}) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const contents = e.target.result;
      const pdf = await getDocument(contents).promise;
      const numPages = pdf.numPages;
      let extractedText = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        extractedText += pageText;
      }

      setEditorState(EditorState.createWithContent(ContentState.createFromText(extractedText)));
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleGeneratePDF = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const htmlContent = draftToHtml(rawContent);
    html2pdf().from(htmlContent).save();
  };


  //   save material to local storage

  const saveMaterial = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const materialText = JSON.stringify(rawContent);
    return materialText;
  };

  
  

  const handleSaveClick = async () => {
    try {
      const updateMaterialData = saveMaterial();
      const updateDiscipline = await axios.put(
          `http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/${materialId}/updateMaterialData`,
          {
            material_data: updateMaterialData,
          }
    );
  } catch (err) {
    console.error(err.message);
  }
  };


  useEffect(() => {
    const getMaterialData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/disciplines/${disciplineId}/topics/${topicId}/${materialId}`
        );
        const data = await response.json();
        if (data.material_data) {
          const contentState = convertFromRaw(JSON.parse(data.material_data));
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (err) {
        console.error(err);
      }
    };

    getMaterialData();
  }, [disciplineId, topicId, materialId]);

  return (
    <>
      <div className={styles.editor}>
        <button onClick={handleGeneratePDF}>SSSS</button>
        <button className={styles.save_btn} onClick={handleSaveClick}>Сохранить</button>
        <Editor editorState={editorState} onEditorStateChange={setEditorState} />
      </div>
    </>
  );
}

export default Notepad;
