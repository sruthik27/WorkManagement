import React from 'react';
import './App.css';
import { Route, Routes, Link, Router } from 'react-router-dom';
import AdminHome from './components/AdminHome';
import AdminMain from './components/AdminMain';
import Coordinator from './components/Coordinator';
import NewTask from './components/NewTask';
import WorkReport from './components/WorkReport';
import NewCoordinator from './components/NewCoordinator';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <AdminHome/> }/>
        <Route path='/AdminMain' element={ <AdminMain/> }/>
        <Route path='/coordinator' element={ <Coordinator/> }/>
        <Route path='/HeadPortal' element={ <NewCoordinator/> }/>
        <Route path='/NewTask' element={ <NewTask/> }/>
        <Route path='/WorkReport' element={ <WorkReport/> }/>
      </Routes>
    </div>
    
  );
}

export default App;
