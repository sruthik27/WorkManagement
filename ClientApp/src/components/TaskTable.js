import React, { Component } from 'react';
import "./AdminMain.css";

class TaskTable extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        activeTask: [],
        completeTask: [],
        incompleteTask: [],
      };
    }
  
    componentDidMount(props) {
      const items = this.props.data;
  
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
                        <h2>Active Task</h2>
                        <ul>
                            {activeTask.map((x, i) => (
                                <p key={i}>{x}</p>
                            ))}
                        </ul>
                    </div>
                    <div >
                        <h2>Completed Task</h2>
                        <ul>
                            {completeTask.map((x,i)=>(<p key={i}>{x}</p>))}
                        </ul>
                    </div>
                    <div>
                        <h2>Completed Task</h2>
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