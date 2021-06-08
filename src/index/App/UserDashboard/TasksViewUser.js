import React from 'react';
import '../shared/TaskView.css';
import {Nav, Modal,Button, Form, ListGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';
import users from '../shared/open-menu.png';


export default class TaskViewUser extends React.Component{
    state = {
        isLoaded: false, 
        modalDisplay: 'none',
        taskDueNavColor: '#dc3545',
        taskDueNavBg: '#FFF',
        taskCompleteNavcolor: '#28a745',
        taskCompleteNavBg: '#FFF',
        markCompleteClicked: false,
        tasks: [],
        nav: '',
        taskAss: '',
        taskID: '',
        projectName: 'Medic Project',
        dueDate: 'Fri 12 May',
        taskDescription: 'Please fill 100 entries for the above project under the category healthcare. Thanks'
    }

    componentDidMount() {
        axios.get("http://localhost:1332/api/v1/admin/assigned_tasks",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
            this.setState({
                isLoaded: true,
                tasks: res.data 
            })
          });

          localStorage.setItem("page", "tasks");
    }

    toggleDeleteModal = () => {
        this.state.deleteModalDisplay === 'none' ? this.setState({deleteModalDisplay: 'block'}) : this.setState({deleteModalDisplay: 'none'})
    }

    toggleModalDisplay = () => {
        this.state.modalDisplay === 'none' ? this.setState({modalDisplay: 'block'}) : this.setState({modalDisplay: 'none'})
        
    }

    markComplete = (id) => {
        axios.post("http://localhost:1332/api/v1/update_task/" + id,{
            complete: true
        }, {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then( res => {
              alert("Succesfully marked task as complete");
              this.setState({
                  markCompleteClicked: false,
                  modalDisplay: 'none'
              });
              this.reloadPage();
          }).catch(err => console.log('sorry' + err))
    }

    reloadPage = () => {
        window.location.reload();
    }

    render(){
        if(this.state.isLoaded){
            
            const loader = <Button variant="primary" disabled>
                                        <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        />
                                        <span className="sr-only">Loading...</span>
                                    </Button>;

          const markCompleteBtn =   <Button variant="primary" onClick={() => {
                                                this.setState({
                                                    markCompleteClicked: true
                                                })
                                                this.markComplete(this.state.taskAss)
                                            }}>{this.state.markCompleteClicked ? loader : 'Mark Complete'}</Button>;

            const tasksList = this.props.userTasks.filter(task => task.userAssigned === this.props.userLoggedIn);
            const completeTasks = tasksList.filter(task => task.complete)
            const dueTasks = tasksList.filter(task => !task.complete)

            const determineList = () => {
                switch(this.state.nav){
                    case 'tasksdue':
                        return dueTasks
                    
                    case 'completeTasks':
                        return completeTasks
                        
                    default:
                        return tasksList    
                }
            }

            return(
                <>
                {/* task modal with info */}
                   <div className="modal-bg" style={{
                            display: this.state.modalDisplay
                        }}>
                        <Modal.Dialog className="modal-add-user" style={{
                            display: this.state.modalDisplay
                        }}>
                            <Modal.Header >
                                <Modal.Title>{this.state.projectName}</Modal.Title>
                            </Modal.Header>
        
                            <Modal.Body>
                                <p>
                                    <strong>Due Date: </strong>
                                    {this.state.dueDate}</p>
                                <br />
                                <p>{this.state.taskDescription}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.toggleModalDisplay}>Close</Button>
                               {
                                 !this.state.markCompleteClicked ? markCompleteBtn : loader
                               }
                            </Modal.Footer>
                            </Modal.Dialog>
                        </div>
    
                <h2 id="h2-title" style={{ position: 'relative', top: '20px' }}>Tasks Management</h2>
                <Nav variant="pills" defaultActiveKey="#" className="navigation-tab-menu" style={{position: 'absolute', left:0, top: '150px'}}>
                            <Nav.Item className="user-tasks-nav"
                                onClick={() => {
                                    this.setState({
                                        taskDueNavBg:"#FFF",
                                        taskDueNavColor: '#dc3545',
                                        taskCompleteNavBg: '#FFF',
                                        taskCompleteNavcolor: '#28a745',
                                        nav: ""
                                    })
                                }}
                            >
                                <Nav.Link href="#">Assigned Tasks List</Nav.Link>
                            </Nav.Item>
    
                            <Nav.Item 
                                className="user-tasks-nav"
                                style={{ 
                                    cursor: 'pointer', 
                                    border: 'solid 1px #dc3545', 
                                    color: this.state.taskDueNavColor,
                                    background: this.state.taskDueNavBg, 
                                    borderRadius: '9px', 
                                    padding:'.5rem .5rem', 
                                    marginLeft: '1rem'}}
                            
                            onClick={() => {
                                this.setState({
                                    taskDueNavColor: 'white',
                                    taskDueNavBg: '#dc3545',
                                    taskCompleteNavBg: '#FFF',
                                    taskCompleteNavcolor: '#28a745',
                                    nav: 'tasksdue'
                                })
                            }}    
                                >
                                Tasks Due {dueTasks.length}
                            </Nav.Item>
    
                            <Nav.Item 
                              className="user-tasks-nav" 
                              style={{
                                  cursor: 'pointer',
                                  border: 'solid 1px #28a745', 
                                  color: this.state.taskCompleteNavcolor,
                                  background: this.state.taskCompleteNavBg, 
                                  borderRadius: '9px', 
                                  padding:'.5rem .5rem', 
                                  marginLeft: '1rem'}}

                               onClick={ () => {
                                    this.setState({
                                        taskCompleteNavBg: '#28a745',
                                        taskCompleteNavcolor: '#FFF',
                                        taskDueNavBg: '#FFF',
                                        taskDueNavColor: '#dc3545',
                                        nav: "completeTasks"

                                    })
                               }}   
                                  >
                                Complete Tasks {completeTasks.length}
                            </Nav.Item>
                           
                            </Nav>
                  <ListGroup style={{minWidth: '50%', maxWidth: '70%', marginTop: '14.5%', cursor: 'pointer'}}>
                   {
                       determineList().reverse().map(task => {
                          return (
                          <ListGroup.Item variant={task.complete ? 'success' : 'danger'} style={{marginBottom: '16px'}} key={task._id} onClick={() => {
                                this.setState({
                                    taskAss: task._id,
                                    projectName: task.projectName,
                                    taskDescription: task.description,
                                    dueDate: task.dueDate
                                });
                                this.toggleModalDisplay()
                              }}>
                              <b style={{
                                  width: '65%'
                              }}>{task.description}</b>
                                <img 
                            src={users} 
                            alt="user avatar" 
                            width="24px" 
                            height= "24px" 
                            style={{
                                position: 'absolute',
                                right: '1.75rem'
                                }} /> 
                              </ListGroup.Item>
                          )
                      })
                   }
                 </ListGroup>
                </>
            )
        }
        return     <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '70%'}}>
        <Spinner animation="grow" />
   </div>
    }
}