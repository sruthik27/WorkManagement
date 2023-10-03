import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AdminHome from './components/AdminHome';
import AdminMain from './components/AdminMain';

function App() {
  return (
    <Routes>
      <Route path='/' element={<AdminHome/>}/>
      <Route path='/AdminMain' element={ <AdminMain/> }/>
    </Routes>
  );
}

export default App;
