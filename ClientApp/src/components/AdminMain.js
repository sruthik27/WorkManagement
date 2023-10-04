import React, { Component } from 'react';
import "./AdminMain.css";
import TaskTable from './TaskTable';

const AdminMain = () => {
  return (
    <>
      <div className="ahome">
        <p className="para">WELCOME TO THE DASHBOARD!</p>
        <TaskTable/>
      </div>
    </>
  );
}

export default AdminMain;
