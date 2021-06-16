import React from 'react';
import '../shared/TaskView.css';
import {Nav,
         Modal,
         Button, 
         Form, 
         Spinner , 
         ListGroup, 
         Popover} from 'react-bootstrap';
import add from './TaskView/add.png';
import axios from 'axios';
import ProjectsList from './ProjectsList';
import _CONFIG from '../../../config/config';


export default class AnalyticsProjects extends React.Component{
    state = {
        modalDisplay: 'none',
        isLoaded: false,
        deleteModalDisplay: 'none',
        tasksList: 'none',
        tasks: [],
        Users: [],
        projects: [],
        assignee: [],
        addBtnClicked: false,
        assigneeID: '',
        assigneeChosen: '',
        assigneeName: 'User',
        getUsersRequest: axios.get(`${_CONFIG.API_URI}/api/v1/admin/get_users`,  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }),
        getProjects: axios.get(`${_CONFIG.API_URI}/api/v1/admin/get_projects`,  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          })  
        }

    componentDidMount() {
        this.state.getUsersRequest.then(res => {
            this.setState({
                isLoaded: true,
                Users: res.data
            })
        });

        this.state.getProjects.then(res => {
            this.setState({
                projects: res.data
            })
        });
       
        localStorage.setItem('id', '');
    }

    

 
    toggleDeleteModal = () => {
        this.state.deleteModalDisplay === 'none' ? this.setState({deleteModalDisplay: 'block'}) : this.setState({deleteModalDisplay: 'none'})
    }

    toggleModalDisplay = () => {
        this.state.modalDisplay === 'none' ? this.setState({modalDisplay: 'block'}) : this.setState({modalDisplay: 'none'})
        
    }

    toggleListsDisplay = () => {
        this.state.tasksList === 'none' ? this.setState({tasksList: 'block'}) : this.setState({ tasksList: 'none'})
        
    }

    deleteTask = (id) => {
        axios.delete(_CONFIG.API_URI+"/api/v1/admin/delete_task/" + id,{
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
             alert(res);
             this.toggleDeleteModal()

          }).catch(err => console.log(err))
    }

    getProjectID = (id) =>{
        this.setState({
           assigneeChosen: id
        })
        return id
    }


    

    render(){
        if(this.state.isLoaded){
         const UserTasks = this.state.tasks.filter(task => {
            return task.userAssigned.toLowerCase() === this.state.assigneeChosen.toLowerCase()
          }); 
         const popover = (
            <Popover id="popover-basic">
              <Popover.Title as="h3">Popover right</Popover.Title>
              <Popover.Content>
                And here's some <strong>amazing</strong> content. It's very engaging.
                right?
              </Popover.Content>
            </Popover>
          );
            return(
                <>

                {/* add projects modal */}
                 <div className="modal-bg" style={{
                            display: this.state.modalDisplay
                        }}>
                        <Modal.Dialog className="modal-add-user" style={{
                            display: this.state.modalDisplay
                        }}>
                            <Modal.Header >
                                <Modal.Title>Add Project</Modal.Title>
                            </Modal.Header>
        
                            <Modal.Body>
                            <Form>
                               <Form.Group controlId="formEventName">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control name="projectname" type="textbox" placeholder="Enter name of project" />
                                </Form.Group>
                            
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control name="taskdetails" as="textarea" rows="4" placeholder="write details of the project" />
                                </Form.Group>

                                <Form.Group controlId="formDuration">
                                    <Form.Label>Project Duration</Form.Label>
                                    <Form.Control name="projectduration" type="textbox" placeholder="e.g 12 Jun - 21 Jul" />
                                </Form.Group>
        
                                </Form>
                            </Modal.Body>
                        <Modal.Footer>
                                <Button variant="secondary" onClick={this.toggleModalDisplay}>Close</Button>
                                <Button variant="primary" onClick={() => {
                                    this.setState({addBtnClicked: true})
                                    console.log('assigning....');
                                    const newProject = {
                                        projectName: document.getElementsByName("projectname")[0].value,
                                        description:   document.getElementsByName("taskdetails")[0].value,
                                        duration: document.getElementsByName("projectduration")[0].value
                                    }

                                    axios.post(_CONFIG.API_URI+"/api/v1/admin/add_project", newProject, {
                                        headers: {
                                        'auth-token': `${localStorage.getItem('auth-token')}`
                                        }
                                    })
                                    .then( res => {
                                        alert('Succesfully added new project');
                                         this.setState({addBtnClicked: false});
                                        this.toggleModalDisplay();
                                    })
                                    .catch(console.error)
                                  
                                }}>{this.state.addBtnClicked ? 'Adding..' : 'Add'}</Button>
                            </Modal.Footer>
                            </Modal.Dialog>
                        </div>
    
                        <div className="modal-bg" style={{
                            display: this.state.deleteModalDisplay
                                }}>
                             
                            <Modal.Dialog  className="modal-add-user" style={{
                            display: this.state.deleteModalDisplay
                                }}>
                            <Modal.Header >
                                <Modal.Title>Delete Task?</Modal.Title>
                            </Modal.Header>
        
                            <Modal.Body>
                                <p>Are you sure you want to delete this task?</p>
                            </Modal.Body>
        
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.toggleDeleteModal}>Cancel</Button>
                                <Button variant="primary" onClick={() => {
                                    this.deleteTask(this.state.assigneeID)
                                    }}>Delete</Button>
                            </Modal.Footer>
                            </Modal.Dialog>
                      
                             </div>  
    
                 <div>
                     <h2 id="page-title">Analytics(Projects)</h2>
                     <Nav variant="pills" defaultActiveKey="#" style={{marginTop: '4rem'}}>
                        <Nav.Item>
                            <Nav.Link href="#">Projects List</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={this.toggleModalDisplay} eventKey="link-1">Add Project<img src={add} alt="add" style={{width: '16px', height: '16px', marginLeft: '5px'}}/></Nav.Link>
                        </Nav.Item>
                        </Nav>
                        <br />
                <section className="section-container">
                <ListGroup  defaultActiveKey="#link1" style={{
                    width: '60%', 
                    height: '100%'
                }}>
                 <ProjectsList getID={this.getProjectID} projectsL={this.state.projects} toggleMod={this.toggleListsDisplay} openAnalytics={this.props.loadPage}/>    
                 </ListGroup>
                </section>
    
            
                      
                    
                 </div>
                </>
            )
        }
        return (
            <div className="spinner-bg">
                <Spinner id="spinner" animation="grow" />
            </div>
            );
    }
}