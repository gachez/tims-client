import React from 'react';
import '../shared/TaskView.css';
import {Nav,
         Modal,
         Button, 
         Form, 
         Spinner , 
         ListGroup, 
         InputGroup, 
         DropdownButton, 
         Dropdown, 
         FormControl} from 'react-bootstrap';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import add from './TaskView/add.png';
import trash from './shared/trash.png';
import axios from 'axios';
import TaskUsers from './TaskView/TaskUsers';
import open from '../shared/open-menu.png';
import _CONFIG from '../../../config/config';


export default class TaskView extends React.Component{
    state = {
        modalDisplay: 'none',
        isLoaded: false,
        deleteModalDisplay: 'none',
        tasksList: 'none',
        reports: [],
        tasks: [],
        Users: [],
        projects: [],
        assignee: [],
        addBtnClicked: false,
        deleteBtnClicked: false,
        assigneeID: '',
        assigneeChosen: '',
        projectName: 'Project',
        assigneeName: 'Task Assignee',
        getUsersRequest: axios.get(_CONFIG.API_URI+"/api/v1/admin/assigned_tasks",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }),
        getTasksRequest: axios.get(_CONFIG.API_URI+"/api/v1/admin/get_users",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }),
        getProjectsRequest: axios.get(_CONFIG.API_URI+"/api/v1/admin/get_projects",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }),
          selectedFile: null,
          file: {},
          data: [],
          cols: []
    }

    componentDidMount() {
         axios.all([this.state.getUsersRequest, this.state.getTasksRequest,this.state.getProjectsRequest]).then(axios.spread((...responses) => {
            this.setState({
                isLoaded: true,
                tasks: responses[0].data,
                Users: responses[1].data,
                projects: responses[2].data
            })            // use/access the results 
          })).catch(errors => {
            // react on errors.
            return errors
          });

          axios.get(_CONFIG.API_URI+"/api/v1/admin/get_reports", {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
              this.setState({
                  reports: res.data
              })
              
          }).catch(err => console.log(err));

          localStorage.setItem("page", "tasks");     
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

    reloadPage = () => {

        this.props.loadPage('tasks');
        window.location.reload()
    }

    deleteTask = (id) => {
        axios.delete(_CONFIG.API_URI+"/api/v1/admin/delete_task/" + id,{
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
             alert('Deleted task succesfully');
             this.reloadPage()

          }).catch(err => console.log(err))
    }

    getUserID = (userName) =>{
        this.setState({
           assigneeChosen: userName
        })
        return userName
    }

     
    handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
      };
     
    handleFile = async (user,project) => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
     
        reader.onload = (e) => { 
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws);
          /* Update state */
      
            this.setState({ 
                data: data, 
                cols: make_cols(ws['!ref'])
             },
              () => {
                  this.state.data.forEach( (imports,index) => {

                     let dataObj = {    
                        projectName: project,
                        companyName:  imports['Company Name'], 
                        contactPerson: imports['Contact Person'],
                        position:   imports['Position'],
                        email1:    imports['Email 1'],
                        email2:   imports['Email 2'],
                        mobile1:   imports['Mobile 1'].toString(),
                        mobile2:   imports['Mobile 2'],
                        website: imports['Website'],
                        industry: imports['Industry'],
                        subSector: typeof imports['Subsector'] === "undefined" ? 'none' : imports['Subsector'].trim(),
                        productDescription: imports['Product Description'],
                        country: imports['Country'],
                        confirmed: imports['Confirmed'] < 1 ? false : true,
                        collectionDate: new Date().toUTCString(),
                        collectionTime: new Date().toUTCString(),
                        submittedBy: 'admin',
                        assignedTo: user                
                      };  
                      
                     let similarReport = this.state.reports.filter(report => report.mobile1 === dataObj.mobile1).map(report => report._id); 
                     console.log(similarReport[0]);

                    axios.post(_CONFIG.API_URI+"/api/v1/admin/add_record", dataObj, {
                        'Content-Type': 'application/json;charset=UTF-8',
                        headers: {
                            'auth-token': `${localStorage.getItem('auth-token')}`
                        }
                    }).then(res => {
                        if(res.data === "Similar record already exists!"){
                            axios.post(_CONFIG.API_URI+"/api/v1/admin/edit_record/" + similarReport[0], dataObj, {
                                'Content-Type': 'application/json;charset=UTF-8',
                                headers: {
                                    'auth-token': `${localStorage.getItem('auth-token')}`
                                }
                            }).then(res => {
                                console.log("Succesfully assigned data...")
                            }).catch(err => console.log(err));
                        return 0;
                        }
                     
                        console.log('Succesfully added file record ' + res.data);
                    }).catch(err => {
                        console.log(err)
                    });
                });
               
            });
        };
     
        if (rABS) {
          reader.readAsBinaryString(this.state.file);
        } else {
          reader.readAsArrayBuffer(this.state.file);
        }
      }

    

    render(){
        if(this.state.isLoaded){
         const UserTasks = this.state.tasks.filter(task => {
            return task.userAssigned.toLowerCase() === this.state.assigneeChosen.toLowerCase()
          }); 
          
            return(
                <>
                    {/* user tasks modal */}
                    <div className="modal-bg" style={{
                            display: this.state.tasksList
                        }}>
                        <Modal.Dialog className="modal-add-user" style={{
                            display: this.state.tasksList
                        }}>
                            <Modal.Header >
                                <Modal.Title style={{ fontSize: '18px'}}>
                                    <span className="complete-tasks-nav" style={{
                                    padding: '8px 8px',
                                    border: 'solid 1px green',
                                    color: 'green',
                                    borderRadius: '8px',
                                    margin: '0.5rem'
                                    }}>Completed tasks {UserTasks.filter(task => task.complete).length} </span>

                            <span className="complete-tasks-nav" style={{
                                    padding: '8px 8px',
                                    border: 'solid 1px #000',
                                    color: '#000',
                                    borderRadius: '8px',
                                    margin: '0.5rem'
                                }}>Tasks Due {UserTasks.filter(task => !task.complete).length}</span></Modal.Title>

                            </Modal.Header>
        
                            <Modal.Body>
                            <ListGroup>
                                {
                                    UserTasks.reverse().map(task => {
                                        return (
                                            <ListGroup.Item 
                                            key={task._id}
                                            variant="light" 
                                            style={{ 
                                                    marginBottom: '15px',
                                                    color: '#000', 
                                                    fontSize: '16px', 
                                                    cursor: 'pointer', 
                                                    display: 'flex', 
                                                    alignContent: 'space-around'}}
                                            onClick={() => {
                                                console.log('does this work?')
                                                this.setState({
                                                    assigneeID: task._id
                                                })
                                            }}        
                                                    >
                                        <p style={{width: '60%', textDecoration: `${task.complete ? 'line-through' : 'none' }`, color: `${task.complete ? 'green' : 'black' }`}}>
                                            {task.description}</p> 
                                 
                                        <img src={trash} alt="trash" width="20px" height="20px" style={{position: 'absolute', right: '25px'}} onClick={this.toggleDeleteModal} /></ListGroup.Item>
                                        )
                                    })
                                }  
                            </ListGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.toggleListsDisplay}>Close</Button>
                            </Modal.Footer>
                            </Modal.Dialog>
                        </div>
    

                {/* assign tasks modal */}
                 <div className="modal-bg" style={{
                            display: this.state.modalDisplay
                        }}>
                        <Modal.Dialog className="modal-add-user" style={{
                            display: this.state.modalDisplay
                        }}>
                            <Modal.Header >
                                <Modal.Title>Assign Task</Modal.Title>
                            </Modal.Header>
        
                            <Modal.Body>
                            <Form>
                               <Form.Group controlId="formEventName">
                                    <Form.Label>Project Name</Form.Label>
                                    <DropdownButton
                                    as={InputGroup.Prepend}
                                    variant="outline-secondary"
                                    title={this.state.projectName}
                                    id="input-group-dropdown-11"
                                    name="project" 
                                    >
                                        {
                                            this.state.projects.map( project => {
                                                return(
                                                <Dropdown.Item key={project._id} onClick={() => {
                                                    this.setState({
                                                        projectName: project.projectName
                                                    })
                                                }} >{project.projectName}</Dropdown.Item>
                                                )
                                            })
                                        }
                                    </DropdownButton>
                                </Form.Group>
                            
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <InputGroup className="mb-3">
                                    <DropdownButton
                                    as={InputGroup.Prepend}
                                    variant="outline-secondary"
                                    title={this.state.assigneeName}
                                    id="input-group-dropdown-1"
                                    name="assignee"
                                    
                                    >
                                        {
                                            this.state.Users.map( user => {
                                                return(
                                                <Dropdown.Item key={user._id} onClick={() => {
                                                    this.setState({
                                                        assignee: user.username,
                                                        assigneeName: user.fullname,
                                                        assigneeID: user._id
                                                    })
                                                }} >{user.fullname}</Dropdown.Item>
                                                )
                                            })
                                        }
                                    </DropdownButton>
                                    <FormControl aria-describedby="basic-addon1" />
                                </InputGroup>
                                </Form.Group>

                                <Form.Group controlId="formTaskDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control name="taskdetails" as="textarea" rows="4" placeholder="write task details" />
                                </Form.Group>
        
                                <Form.Group controlId="formDueDate">
                                    <Form.Label>Due date</Form.Label>
                                    <input type="date" name="date" />
                                </Form.Group>
        
                                </Form>
                            </Modal.Body>
    
                              <Modal.Footer>
                                <Button variant="secondary" onClick={this.toggleModalDisplay}>Close</Button>
                                <Button variant="primary" onClick={async () => {
                                    this.setState({
                                        addBtnClicked: true
                                    });
                                    // await this.handleFile(this.state.assignee, this.state.projectName);

                                    const newTask = {
                                        projectName: this.state.projectName,
                                        userAssigned: this.state.assignee,
                                        description:   document.getElementsByName("taskdetails")[0].value,
                                        dueDate: document.getElementsByName("date")[0].value
                                    }

                                    axios.post(_CONFIG.API_URI+"/api/v1/admin/create_task", newTask, {
                                        headers: {
                                        'auth-token': `${localStorage.getItem('auth-token')}`
                                        }
                                    })
                                    .then( res => {
                                        alert('Succesfully assigned new task');
                                        console.log(newTask);
                                        this.reloadPage();

                                    })
                                    .catch(console.error)
                                  
                                }}>{this.state.addBtnClicked ? 'Assigning...' : 'Assign'}</Button>
                            </Modal.Footer>
                            </Modal.Dialog>
                        </div>
    
                        {/* delete task modal  */}
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
                                    this.setState({
                                        deleteBtnClicked: true
                                    });
                                    this.deleteTask(this.state.assigneeID);
                                    
                                }}>{!this.state.deleteBtnClicked ? 'Delete' : 'Deleting...' }</Button>
                            </Modal.Footer>
                            </Modal.Dialog>
                      
                             </div>  
    
                 <div>
                     <h2 id="page-title">Task Management</h2>
                     <Nav variant="pills" defaultActiveKey="#" style={{marginTop: '5rem'}}>
                        <Nav.Item>
                            <Nav.Link href="#">Assignees List</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={this.toggleModalDisplay} eventKey="link-1">Assign task<img src={add} alt="add" style={{width: '16px', height: '16px', marginLeft: '5px'}}/></Nav.Link>
                        </Nav.Item>
                        </Nav>
                        <br />
                <section className="section-container">
                <ListGroup  defaultActiveKey="#link1" style={{
                    width: '60%',
                    height: '100%'
                }}>
                 <TaskUsers getID={this.getUserID} openTasks={open} toggleMod={this.toggleListsDisplay} taskUsers={this.state.Users} />
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