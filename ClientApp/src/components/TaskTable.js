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

    componentDidMount() {
        // Check if itemData is available before processing
        if (this.props.data.length > 0) {
            this.processData(this.props.data);
        }
    }

    // Add componentDidUpdate to handle updates to props.data
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.processData(this.props.data);
        }
    }

    processData(data) {
        let activeTask = [];
        let completeTask = [];
        let incompleteTask = [];

        data.forEach(x => {
            if (x.work_status === 'A') activeTask.push(x.work_name);
            else if (x.work_status === 'C') completeTask.push(x.work_name);
            else if (x.work_status === 'I') incompleteTask.push(x.work_name);
        });

        this.setState({
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
                        <h2>Incomplete Task</h2>
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