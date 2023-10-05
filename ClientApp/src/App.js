import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AdminHome from './components/AdminHome';
import AdminMain from './components/AdminMain';
import Coordinator from './components/Coordinator';
function App() {
  return (
    <Routes>
      <Route path='/' element={<AdminHome/>}/>
      <Route path='/AdminMain' element={ <AdminMain/> }/>
      <Route path='/co-ordinator' element={<Coordinator/>}/>
    </Routes>
  );
}

export default App;
