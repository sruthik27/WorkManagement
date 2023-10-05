import React, { Component } from 'react';
import "./AdminMain.css";
import TaskTable from './TaskTable';
import PieChart from './PieChart';
import PopUp from './PopUp';

class AdminMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemData: [],
      percent: 0,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const response = await fetch('/db/getworks'); //need to add "/getWorks" after backend is pushed
      const data = await response.json();
      this.setState({ itemData: data });

      const popUpData = data[0];
      this.setState({ popUpdata: popUpData});
      const totalTask = data.length;
      const completeTask = data.filter(x => x.work_status === 'C').length;
      const calculatedPercent = (completeTask / totalTask) * 100;
      this.setState({ percent: calculatedPercent });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  render() {
    const { itemData, percent, popUpdata } = this.state;

    return (
        <div className="ahome">
          <p className="para">WELCOME TO THE DASHBOARD!</p>
          <TaskTable data={itemData} />
          <div className='base-item'>
            <div>
              <h2>Progress for the day:</h2>
              <PieChart percentage={percent}/>
            </div>
            <div>
              <div className='feedback'>
                <h2>Broadcast Announcements</h2>
                <input className='feedback-input' placeholder='Type announcement here...'/>
                <button className='send-button'>SEND</button>
              </div>
            </div>
          </div>
          <div>
            <PopUp trigger={false}>
              <div>
                <h2>Work Details:</h2>
                <p>Work Name:</p>
                <p>Time Period: xx - yy</p>
                <p>Coordinator:</p>
                <p>Worker:</p>
              </div>
            </PopUp>
          </div>
        </div>
    );
  }
}

export default AdminMain;