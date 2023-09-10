import './App.css';
import RegistrationPage from "../src/components/pages/RegistrationPage/RegistrationPage"
import StartPage from "../src/components/pages/StartPage/StartPage"
import LoginPage from "../src/components/pages/LoginPage/LoginPage"
import SubjectsPage from "../src/components/pages/SubjectsPage/SubjectsPage"
import DisciplinePage from './components/pages/DisciplinePage/DisciplinePage';
import TopicsPage from './components/pages/TopicsPage/TopicsPage';
import AIpage from './components/pages/AIpage/AIpage';
import MaterialsPage from "./components/pages/MaterialsPage/MaterialsPage"
import MaterialPage from "./components/pages/MaterialPage/MaterialPage"
import { Routes,Route } from 'react-router-dom';
import React  from 'react';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<StartPage />} />
        <Route path="/registration" exact element={<RegistrationPage />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/disciplines" exact element={<SubjectsPage />} />
        <Route path="/disciplines/:disciplineId" exact element={<DisciplinePage />} />
        <Route path='/disciplines/:disciplineId/topics' exact element={<TopicsPage />} />
        <Route path='/AI' exact element={<AIpage />} />
        <Route path='/disciplines/:disciplineId/topics/:topicId' exact element={<MaterialsPage/>} />
        <Route path='/disciplines/:disciplineId/topics/:topicId/:materialId' exact element={<MaterialPage/>} />
      </Routes>
        
    </div>
  );
}

export default App;