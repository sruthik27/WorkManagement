import React, { Component } from 'react';
import TaskTable from './TaskTable';
import "./AdminMain.css";
import NewTask from './NewTask';

class Coordinator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemData: [],
        };
    }

    componentDidMount() {
        this.fetchData();
      }
    
      async fetchData() {
        try {
          const response = await fetch('/db/getworks'); 
          const data = await response.json();
          this.setState({ itemData: data });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

    render() {
        const { itemData } = this.state;

        return (
            <>
                <div className='ahome'>
                    <TaskTable data={itemData}/>
                </div>
                <div className='coordinator-buttons'>
                    <button className='coo-button' >ASSIGN WORK</button>
                    <button className='coo-button'>CREATE NEW WORK</button>
                </div>
            </>
        )
    }
}

export default Coordinator;