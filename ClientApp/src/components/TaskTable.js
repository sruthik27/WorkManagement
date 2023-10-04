import React, { Component } from 'react';
import "./AdminMain.css";

class TaskTable extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        items: [],
        activeTask: [],
        completeTask: [],
        incompleteTask: [],
      };
    }
  
    componentDidMount() {
      const items = [{work_id:123456,work_name:'Building IP',work_description:'to build a new image processing lab',work_status:'A',start_date:'04-10-23',due_time:'04-11-23',total_subtasks:5,wage:100000,worker:'kabilan',advance_paid:false,bill_paid:false,coordinator:'rhoomi'},{work_id:1234567,work_name:'Building Embedded',work_description:'to build a new embedded lab',work_status:'A',start_date:'04-10-23',due_time:'04-11-23',total_subtasks:4,wage:10000,worker:'madhan',advance_paid:false,bill_paid:false,coordinator:'hariharan'},{work_id:12345678,work_name:'Building lab',work_description:'to build a new networking lab',work_status:'C',start_date:'04-10-23',due_time:'04-11-23',total_subtasks:5,wage:100000,worker:'rithik',advance_paid:false,bill_paid:false,coordinator:'principal'},{work_id:123456789,work_name:'Building lab',work_description:'to build a new vlsi lab',work_status:'I',start_date:'04-10-23',due_time:'04-11-23',total_subtasks:5,wage:100000,worker:'Bala',advance_paid:false,bill_paid:false,coordinator:'HOD'}];
  
      let activeTask = [];
      let completeTask = [];
      let incompleteTask = [];
  
      items.forEach(x => {
        if (x.work_status === 'A') activeTask.push(x.work_name);
        else if (x.work_status === 'C') completeTask.push(x.work_name);
        else if (x.work_status === 'I') incompleteTask.push(x.work_name);
      });
  
      this.setState({
        items,
        activeTask,
        completeTask,
        incompleteTask,
      });
    }
  
    render() {
        const { activeTask, completeTask, incompleteTask } = this.state;
  
        return (
            <>
                <div className="task-table">
                    <div>
                        <h1>Active Task</h1>
                        <ul>
                            {activeTask.map((x, i) => (
                                <p key={i}>{x}</p>
                            ))}
                        </ul>
                    </div>
                    <div >
                        <h1>Completed Task</h1>
                        <ul>
                            {completeTask.map((x,i)=>(<p key={i}>{x}</p>))}
                        </ul>
                    </div>
                    <div>
                        <h1>Completed Task</h1>
                        <ul>
                            {incompleteTask.map((x,i)=>(<p key={i}>{x}</p>))}
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}

export default TaskTable;