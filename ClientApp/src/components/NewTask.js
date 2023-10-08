import React, {useState} from "react";
import {useEffect} from "react";
import {Modal, Button, Form, Container, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

const NewTask = () => {
    const [coords, setCoords] = useState([]);
    const [workName, setWorkName] = useState("");
    const [workCost, setWorkCost] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [taskDescription, setTaskDescription] = useState("");
    const [coordinator, setCoordinator] = useState("");
    const [subtaskDescription, setSubtaskDescription] = useState("");
    const [subtaskDueDate, setSubtaskDueDate] = useState(new Date());
    const [noOfSubtasks, setNoOfSubtasks] = useState(1);
    const [subtasks, setSubtasks] = useState([]);
    const [showModal, setShowModal] = useState(false);


    const fetchCoordsNames = () => {
        fetch('/db/getcoords')
            .then(response => response.json())
            .then(data => setCoords(data))
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
            fetchCoordsNames();
        }
    )

    const handleFormSubmit = () => {
        const newWork = {
            work_name: workName,
            work_description: taskDescription,
            work_status: 'A', // You can change this as needed
            start_date: startDate.toISOString(),
            due_date: dueDate.toISOString(),
            total_subtasks: 0,
            completed_subtasks: 0,
            wage: workCost,
            advance_paid: false,
            bill_paid: false,
            coordinator: coordinator,
            // Add the other fields as needed
        };
        console.log(newWork);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var jsonData = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(newWork), // Convert JavaScript object to JSON
            redirect: 'follow'
        };
        fetch("/db/addwork", jsonData)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    };

    // Function to handle subtask form submit
    const handleSubtaskFormSubmit = () => {
        const newSubtask = {
            task_name: subtaskDescription,
            due_date: subtaskDueDate.toISOString(),
            completed: false,
            order_no: noOfSubtasks
        };
        setSubtasks([...subtasks, newSubtask]);
        setNoOfSubtasks(x => x + 1);
        setSubtaskDescription("");
        setSubtaskDueDate(new Date());
        handleCloseModal();
    };

    // Functions to handle modal visibility
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <Container className="mt-4">
                <Row className="justify-content-md-center">
                    <Col xs={12} md={8}>
                        <h1 className="text-center">PUBLISH NEW TASK</h1>
                        <Form>
                            <Form.Group>
                                <Form.Label>Work Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Type Work Name"
                                    value={workName}
                                    onChange={event => setWorkName(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Work Cost</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Type Work Cost"
                                    value={workCost}
                                    onChange={event => setWorkCost(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate.toISOString().split('T')[0]}
                                    onChange={(event) => setStartDate(new Date(event.target.value))}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dueDate.toISOString().split('T')[0]}
                                    onChange={(event) => setDueDate(new Date(event.target.value))}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Task Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Type task description"
                                    onChange={(event) => setTaskDescription(event.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Coordinator</Form.Label>
                                <Form.Control as="select" value={coordinator}
                                              onChange={(event) => setCoordinator(event.target.value)}>
                                    <option value="" disabled>Select Coordinator</option>
                                    {coords.map((v, i) => (
                                        <option key={i} value={v.coordinator_id}>{v.coordinator_name}</option>))}
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" onClick={handleShowModal} className="mr-2">
                                Add Subtask
                            </Button>
                            <br/>
                            <Button variant="success" onClick={handleFormSubmit}>
                                Add Task
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Subtask {noOfSubtasks}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter subtask description"
                                value={subtaskDescription}
                                onChange={(event) =>
                                    setSubtaskDescription(event.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={subtaskDueDate.toISOString().split("T")[0]}
                                onChange={(event) =>
                                    setSubtaskDueDate(new Date(event.target.value))
                                }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubtaskFormSubmit}>
                        Add Subtask
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>
                {subtasks.map((subtask, index) => (
                    <div key={index}>
                        <p>Description: {subtask.description}</p>
                        <p>Due Date: {new Date(subtask.due_date).toDateString()}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default NewTask;