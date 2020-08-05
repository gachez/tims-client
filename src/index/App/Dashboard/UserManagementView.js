import React from 'react';
import './UserManagementView/UserManagement.css';
import {Spinner, Table, Nav, Modal, Button,Form} from 'react-bootstrap';
import trash from './shared/trash.png';
import edit from '../shared/edit.png';
import add from './UserManagementView/signs.png';
import axios from 'axios';

export default class UserManagement extends React.Component{
    state = {
        modalDisplay: 'none',
        isLoaded: false,
        deleteModalDisplay: 'none',
        navigation: 'view',
        editSave: 'none',
        users: [],
        deleteUserId: '',
        deleteBtnClicked: false,
        addBtnClicked: false,
        saveBtnClicked: false,
        editBtnClicked: false,
        editModal: 'none',
        editFieldID: '',
        editFieldIndex: 0
    }

    componentDidMount() {
        axios.get('https://a123ef.df.r.appspot.com/api/v1/admin/get_users', {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          })
        .then(res => {
            this.setState({
                isLoaded: true,
                users: res.data
            });
        }).catch(err => {
            console.log('error getting users' + err)
        });


        localStorage.setItem("page", "user-management");
    }

    toggleModalDisplay = () => {
        this.state.modalDisplay === 'none' ? this.setState({modalDisplay: 'block'}) : this.setState({modalDisplay: 'none'})
        
    }

    toggleDeleteModal = () => {
        this.state.deleteModalDisplay === 'none' ? this.setState({deleteModalDisplay: 'block'}) : this.setState({deleteModalDisplay: 'none'})
    }

    toggleSave = () => {
        this.state.editSave === 'none' ? this.setState({editSave: 'block'}) : this.setState({editSave: 'none'})
    }

    toggleEditModalDisplay = () => {
        this.state.editModal === 'none' ? this.setState({editModal: 'block'}) : this.setState({editModal: 'none'})

    }

    getEditField = (id ) => {
        const field = this.state.users.filter(report => report._id === id);
        return field;
    }

    onEditClick = () => {
        this.setState({
            navigation: 'edit'
        }, () => {
            this.toggleSave();
        })
    }

    returnEditFields = (placeHolder) => {
        return(
            <Form.Control style={{width: '300px'}} className="edit-fields" type="text" placeholder={placeHolder}></Form.Control>
        )
    }

    addUser = async () => {
            const user = {
                fullname: document.getElementsByName('fullname')[0].value, 
                username: document.getElementsByName('username')[0].value,
                email: document.getElementsByName('email')[0].value,
                password: document.getElementsByName('password')[0].value   
            }
            try{
                axios.post("https://a123ef.df.r.appspot.com/api/v1/register_user", user)
                .then(res => {
                    console.log('succesfully created user ' + res)
                    alert('Succesfully added a new user');
                    this.setState({
                        modalDisplay: 'none'
                    });
                    this.reloadPage();
                }).catch (err => { console.log(err)})
        } catch (err) {console.log(err)}
    } 



    saveEditedFied = async (id) => {
        console.log('saving...')
        this.setState({
            editBtnClicked: 1
        })
       try{

        const edits = await Array.from(document.getElementsByClassName('edit-forms')[0]).map(node => node)
       
        const saveEdits = {
            fullname:  edits[0].value.length < 1 ? edits[0].getAttribute('placeholder') : edits[0].value, 
            username:  edits[1].value.length < 1 ? edits[1].getAttribute('placeholder') : edits[1].value, 
            email:  edits[2].value.length < 1 ? edits[2].getAttribute('placeholder') :    edits[2].value
        }

        // console.log(saveEdits)
        axios.post(`https://a123ef.df.r.appspot.com/api/v1/admin/edit_user/${id}`, saveEdits, {
            headers: {
                'auth-token': `${localStorage.getItem('auth-token')}`
              }
        }).then(res => {
            alert("Succesfully saved your changes");     
                console.log(res);
                this.toggleEditModalDisplay();
                this.reloadPage();
        }).catch(err => console.log(err))
       } catch(err) {console.log(err)}
    }

    reloadPage = () => {
        window.location.reload()
    }

    removeUser = async (id) => {
            try{
                axios.delete("https://a123ef.df.r.appspot.com/api/v1/admin/delete_user/" + id,  {
                    headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`
                    }
                })
                .then(res => {
                    console.log('succesfully deleted user ' + res)
                    alert('Succesfully deleted user');
                    this.toggleDeleteModal();
                    this.reloadPage();
                }).catch (err => { console.log(err)})
        } catch (err) {console.log(err)}
    }

    editUser = async (editId, edits) => {
        try{
            axios.post("https://a123ef.df.r.appspot.com/api/v1/admin/edit_user/" + editId, edits, {   headers: {
                'auth-token': `${localStorage.getItem('auth-token')}`
                }
            })
            .then( res => {
                console.log('succesfully edited user ' + res.data)
                alert('Saved changes!');
            })
        } catch (err) {console.log(err)}
    }
 
    render(){
        if(this.state.isLoaded) {

            const deleteBtn = <Button variant="primary" onClick={() => {
                                    this.setState({
                                        deleteBtnClicked: true
                                    })
                                    this.removeUser(this.state.deleteUserId)
                                }}>Delete</Button>;
           
           const loadingDeleteBtn = <Button variant="primary" disabled>
                                                    <Spinner
                                                        as="span"
                                                        animation="grow"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    Deleting...
                                                </Button> ;


            const addBtn = <Button variant="primary" onClick={() => {
                this.addUser();
                this.setState({
                    addBtnClicked: true
                })
            }}>Add</Button>;
          
            const loadingAddBtn = <Button variant="primary" disabled>
                                                    <Spinner
                                                    as="span"
                                                    animation="grow"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    />
                                                    Adding...
                                                </Button>;

            const saveBtn = <Button>Save</Button>;
            const loadSave = <Button variant="primary" disabled>
                                                <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                />
                                                Saving...
                                            </Button>;

            const editedRecords = Array.from(document.getElementsByClassName('user-rows')).map( editedrecords => {
                return editedrecords.cells
             }); 

            //  const getUpdatedRecords = () => {
            //      const updated = editedRecords.filter( record => {

            //      })
            //  }

            //save the changes made
            const saveUpdates = async () => {
                try{
                    const edits = await editedRecords;
                    this.state.editSave === 'block' ? 
                    // this.setState({
                    //     saveBtnClicked: true
                    // })
                    editedRecords.map(record => {
                        console.log({
                            fullname: record[1].innerText,
                            username: record[2].innerText,
                            email: record[3].innerText
                        })
                    })
                    :
                     console.log('edit not active')
                    
                } catch (err) { return err}
            }

            const saveLoadingBtn =  <Button variant="primary" disabled>
            <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            Saving...
            </Button>;

            const saveEditBtn = <Button variant="primary" onClick={() => {
              this.saveEditedFied(this.state.editFieldID) 
            }}>
            Save
            </Button>;

            return(
                <>
                <h2 className="user-title">USER MANAGEMENT</h2>
                <Nav variant="pills" className="navigation-tab" defaultActiveKey="#">
                    <Nav.Item >
                        <Nav.Link href="#" onClick={ () => {
                                this.setState({
                                    editSave: 'none'
                                })
                                }}>View users</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1" onClick={() => {
                            this.setState({
                                modalDisplay: 'block',
                                editSave: 'none'
                            })
                        }}>Add user<img src={add} alt="add" style={{width: '16px', height: '16px', marginLeft: '5px'}}/></Nav.Link>
                    </Nav.Item>
                    <Nav.Item id="save" style={{
                        display: this.state.editSave
                    }}
                    onClick={ async () => {
                        this.setState({
                            saveBtnClicked: true
                        })
                        console.log(await Promise.all([saveUpdates()])); 
                    }}
                    >
                        {!this.state.saveBtnClicked ? saveBtn : loadSave}
                    </Nav.Item>
                </Nav>
                <Table className="user-table" striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map((user,index) => {
                                return(
                                <>
                                 <img  key={index} src={edit} style={{marginLeft: '-15px'}} width="32px" height="32px" className="delete-icon" 
                                        onClick={() => {
                                            this.setState({
                                                editFieldID: user._id,
                                                editFieldIndex: index
                                            });
                                            this.toggleEditModalDisplay()
                                            }}/> 
                                  <img  key={user._id} src={trash} className="delete-icon" onClick={() => {
                                    this.toggleDeleteModal();
                                    this.setState({
                                        deleteUserId: user._id
                                        });
                                    }}/>
                                    <tr key={user._id} className="user-rows" identifier={user._id} >
                                    <td>{index + 1}</td>
                                    <td>{this.state.editSave === 'none' ? user.fullname : this.returnEditFields(user.fullname)}</td>
                                    <td>{this.state.editSave === 'none' ? user.username : this.returnEditFields(user.username)}</td>
                                    <td>{this.state.editSave === 'none' ? user.email : this.returnEditFields(user.email)}</td>
                                    </tr>
                                </>
                                )
                            })
                        }
                    </tbody>
                    </Table>
                    <div className="modal-bg" style={{
                        display: this.state.modalDisplay
                    }}>
                    <Modal.Dialog className="modal-add-user" style={{
                        display: this.state.modalDisplay
                    }}>
                        <Modal.Header >
                            <Modal.Title>Add User (max. 20 users)</Modal.Title>
                        </Modal.Header>
    
                        <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFullName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control name="fullname" type="textbox" placeholder="Enter name" />
                            </Form.Group>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control name="username" type="textbox" placeholder="Enter username" />
                            </Form.Group>
    

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" type="textbox" placeholder="example@emaple.com" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Password" />
                            </Form.Group>

                            </Form>
                        </Modal.Body>
    
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.toggleModalDisplay}>Close</Button>
                            {
                                !this.state.addBtnClicked ? addBtn : loadingAddBtn
                            }
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
                            <Modal.Title>Delete User?</Modal.Title>
                        </Modal.Header>
    
                        <Modal.Body>
                            <p>Are you sure you want to delete this user?</p>
                        </Modal.Body>
    
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.toggleDeleteModal}>Cancel</Button>
                            {
                               !this.state.deleteBtnClicked ?  deleteBtn : loadingDeleteBtn
                            }
                        </Modal.Footer>
                        </Modal.Dialog>
                         </div>  

                               {/* edit user modal */}
                <div className="modal-bg" style={{
                    display: this.state.editModal
                }}>
                    <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                        display: this.state.editModal
                    }}>
                        <Modal.Header >
                            <Modal.Title>Edit Field</Modal.Title>
                        </Modal.Header>

                        <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                         <Form className="edit-forms">
                            <Form.Group controlId="fullname">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.fullname)} />
                            </Form.Group>    

                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.username)} />
                            </Form.Group>    

                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder={this.getEditField(this.state.editFieldID).map(field => field.email)}/>
                            </Form.Group>                       
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.toggleEditModalDisplay}>Cancel</Button>
                            {
                                this.state.editBtnClicked < 1 ? saveEditBtn : saveLoadingBtn
                            }
                        </Modal.Footer>
                        </Modal.Dialog>
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