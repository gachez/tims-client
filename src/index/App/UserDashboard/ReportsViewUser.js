import React from 'react';
import '../shared/ReportsView.css';
import {Spinner,Table, Nav, Modal, Form, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import tick from '../shared/tick.png';
import axios from 'axios';
import edit from '../shared/edit.png';
import { categories } from '../shared/lib/categories';
import { SheetJSFT } from '../Dashboard/types';
import comment from '../shared/chatbox.png';
import _CONFIG from '../../../config/config';
import { trimLower } from '../shared/lib/util';
import Search from '../components/Search';

export default class ReportsViewUser extends React.Component{
    state = {
        modalDisplay: 'none',
        editSave: 'none',
        isLoaded: false,
        emailModal: 'none', 
        editReportModal: 'none',
        sendAdminModal: 'none',
        importFileModal: 'none',
        commentModal: 'none',
        reports: [], 
        editFieldID: '',
        editBtnClicked: false,
        addBtnClicked: false,
        addCommentBtnClicked: false,
        deleteModalDisplay: 'none',
        deleteBtnClicked: false,
        chosenIndustry: 'Industry',
        projectName: 'Project',
        projects: [],
        individualEmailModule: 'none',
        importBtnClicked: false,
        determinedIndustry: 'Industry',
        industries: [],
        defaultReports: []
    }

    componentDidMount() {
        axios.get(_CONFIG.API_URI+"/api/v1/admin/get_reports",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {

            this.setState({
                reports: res.data.filter(report => report.submittedBy === this.props.userLoggedIn || this.checkUndefined(report.assignedTo) === this.props.userLoggedIn),
                defaultReports: res.data,
                isLoaded: true
            });
          });

          axios.get(_CONFIG.API_URI+'/api/v1/admin/get_industries',{
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
              this.setState({
                  industries: res.data
              })
          })

          axios.get(_CONFIG.API_URI+"/api/v1/admin/get_projects",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {

            this.setState({
                projects: res.data,
                isLoaded: true
            });
          });

          localStorage.setItem("page", "home");
    }

    onEditClick = () => {
        this.setState({
            navigation: 'edit'
        }, () => {
            this.toggleSave();
        })

    }


    toggleModalDisplay = () => {
        this.state.modalDisplay === 'none' ? this.setState({modalDisplay: 'block'}) : this.setState({modalDisplay: 'none'})
        
    }

    toggleEmailModalDisplay = () => {
        this.state.emailModal === 'none' ? this.setState({emailModal: 'block'}) : this.setState({emailModal: 'none'})
        
    }

    toggleIndividualEmailModalDisplay = () => {
        this.state.individualEmailModule === 'none' ? this.setState({individualEmailModule: 'block'}) : this.setState({individualEmailModule: 'none'})
        
    }

    toggleAdminModalDisplay = () => {
        this.state.sendAdminModal === 'none' ? this.setState({sendAdminModal: 'block'}) : this.setState({sendAdminModal: 'none'})
        
    }

    toggleEditModalDisplay = () => {
        this.state.editReportModal === 'none' ? this.setState({editReportModal: 'block'}) : this.setState({editReportModal: 'none'})

    }

    toggleImportModalDisplay = () => {
        this.state.importFileModal === 'none' ? this.setState({importFileModal: 'block'}) : this.setState({importFileModal: 'none', importBtnClicked: 0})
        
    }

    toggleDeleteModal = () => {
        this.state.deleteModalDisplay === 'none' ? this.setState({deleteModalDisplay: 'block'}) : this.setState({deleteModalDisplay: 'none'})
    }


    toggleCommentModalDisplay = () => {
        this.state.commentModal === 'none' ? this.setState({commentModal: 'block'}) : this.setState({commentModal: 'none'})
    }

    getEditField = (id ) => {
        return this.state.reports.filter(report => report._id === id)
    }
 
    markComplete = (id) => {
        console.log('..marking')
        axios.post(`${_CONFIG.API_URI}/api/v1/admin/edit_record/${id}`, {
            confirmed: true
        },{
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
              alert("Marked as confirmed" + res);
              this.reloadPage();
              console.log(res);
          }).catch(err => {
              console.log(err)
          })
    }  

    saveEditedFied = async (id) => {
        this.setState({
            editBtnClicked: 1
        })
       try{

        const edits = await Array.from(document.getElementById('edit-form')).map(node => node)
       
        const saveEdits = {
            organization:  document.getElementById('edit-organisation').value.length < 1 ? document.getElementById('edit-organisation').getAttribute('placeholder') : document.getElementById('edit-organisation').value, 
            website: document.getElementById('edit-website').value.length < 1 ? document.getElementById('edit-website').getAttribute('placeholder') : document.getElementById('edit-website').value,
            contacts:   document.getElementById('edit-contacts').value.length < 1 ? document.getElementById('edit-contacts').getAttribute('placeholder') : document.getElementById('edit-contacts').value,
            contactPerson:  document.getElementById('edit-contactPerson').value.length < 1 ? document.getElementById('edit-contactPerson').getAttribute('placeholder') : document.getElementById('edit-contactPerson').value,
            telephone:  document.getElementById('edit-telephone').value.length < 1 ? document.getElementById('edit-telephone').getAttribute('placeholder') : document.getElementById('edit-telephone').value,
            designation:   document.getElementById('edit-designation').value.length < 1 ? document.getElementById('edit-designation').getAttribute('placeholder') : document.getElementById('edit-designation').value,
            emailAddress:   document.getElementById('edit-emailAddress').value.length < 1 ? document.getElementById('edit-emailAddress').getAttribute('placeholder'): document.getElementById('edit-emailAddress').value,
            physicalLocation: document.getElementById('edit-physicalLocation').value.length < 1 ? document.getElementById('edit-physicalLocation').getAttribute('placeholder') : document.getElementById('edit-physicalLocation').value,
            industry: trimLower(this.state.determinedIndustry) === trimLower('Industry') ? document.getElementsByName('industryEdit')[0].getAttribute('title') : this.state.determinedIndustry
        }

        // console.log(saveEdits)
        axios.post(`${_CONFIG.API_URI}/api/v1/admin/edit_record/${id}`, saveEdits, {
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
        window.location.reload();
    }

    addReport = async () => {
            const fields = Array.from(document.getElementsByClassName('add-form-fields')).map(field => field);
            this.setState({addBtnClicked: true});
            const savedReport = {
                organization:  fields[0].value, 
                website: fields[1].value,
                contacts:   fields[2].value,
                contactPerson:    fields[3].value,
                telephone:   fields[4].value,
                designation:   fields[5].value,
                emailAddress:   fields[6].value,
                physicalLocation: fields[7].value,
                industry: this.state.determinedIndustry,
                collectionDate: new Date(),
                collectionTime: new Date(),
                submittedBy: this.props.userLoggedIn,
                projectName: this.state.projectName
            }
        try{
            axios.post(_CONFIG.API_URI+"/api/v1/user/add_record", savedReport, {
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`
                }
            }).then(res => {
                console.log(res);
                this.setState({
                    addBtnClicked: 0,
                });
                this.reloadPage();
                
                return savedReport;
            }).catch(err => {
                console.log(err)
            })
        } catch(err) {console.log(err)}

    }

    addRecordAndSendToAdmin = async () => {
        this.addReport();
    
        try{
            const savedReport = {
                organization:  document.getElementById('add-organisation').value, 
                website: document.getElementById('add-website').value,
                contacts: document.getElementById('add-contacts').value,
                contactPerson: document.getElementById('add-contact-person').value,
                telephone: document.getElementById('add-telephone').value,
                designation:   document.getElementById('add-designation').value,
                emailAddress:   document.getElementById('add-email-address').value,
                physicalLocation: document.getElementById('add-physical-location').value,
                industry: this.state.determinedIndustry,
                collectionDate: new Date(),
                collectionTime: new Date(),
                submittedBy: this.props.userLoggedIn,
                projectName: this.state.projectName
            }
            axios.post(_CONFIG.API_URI+"/api/v1/admin/add_record", savedReport, {
                'Content-Type': 'application/json;charset=UTF-8',
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`
                }
            }).then(res => {
                alert('succesfully added ' + res)
                this.setState({
                    addBtnClicked: 0,
                });
                this.toggleAddModalDisplay();
                this.reloadPage();
            }).catch(err => {
                console.log(err)
                document.getElementById('warning').value = err
            
            })
        } catch(err) {console.log(err)}
    }

    sendToAdmin = (data) => {
                      //post to admin reports database
                      axios.post(_CONFIG.API_URI+"/api/v1/admin/add_record", data, {
                        headers: {
                        'auth-token': `${localStorage.getItem('auth-token')}`
                        }
                    }).then(res => {
                        alert("Succesfully sent to admin");
                        this.toggleAddModalDisplay();
                        this.reloadPage();
                    }).catch(err => {
                        console.log(err);
                    })
    }

    updateSubmitStatus = (id) => {
        console.log('updating status')
        //update submitted status to true
        axios.post(_CONFIG.API_URI+"/api/v1/user/edit_record/" + id, {
            submitted: true
        }, {
            headers: {
            'auth-token': `${localStorage.getItem('auth-token')}`
            }
        }).then(res => {
            console.log('updated status of ' + res)
        }).catch(err => console.log(err));

    }

    sendRecentReportstoAdmin = () => {
        //get the reports to submit
        const userReports = this.state.reports.filter(report => report.submittedBy.toLowerCase() === this.props.userLoggedIn.toLowerCase());
        const reportsToSubmit = userReports.filter(report => !report.submitted);

        //merge to admin report db
        const sendThis = reportsToSubmit.map(report => {
              //post to admin reports database
            axios.post(_CONFIG.API_URI+"/api/v1/admin/add_record", {
                organization:  report.organization, 
                website: report.website,
                contacts:   report.contacts,
                contactPerson:   report.contactPerson,
                telephone:   report.telephone,
                designation:   report.designation,
                emailAddress:   report.emailAddress,
                physicalLocation: report.physicalLocation,
                industry: report.industry,
                collectionDate: new Date(),
                collectionTime: new Date(),
                submittedBy: this.props.userLoggedIn
            }, {
                headers: {
                'auth-token': `${localStorage.getItem('auth-token')}`
                }
            }).then(res => {
                this.updateSubmitStatus(report._id);
                alert("Succesfully sent to admin");
                this.toggleAdminModalDisplay();
                this.reloadPage();
            }).catch(err => {
                console.log(err);
            })
            
        });

    }

    // add comment to report entry
    addComment = async (id) => {
        try{

            const comments = await document.getElementById('comment-field').value;

            // added comments
            axios.post(`${_CONFIG.API_URI}/api/v1/admin/edit_record/${id}`, {comments: comments}, {
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`
                  }
            }).then(res => {
                alert("Comment added");     
                    this.toggleCommentModalDisplay();
                    this.reloadPage();
            }).catch(err => console.log(err))
    
        } catch(err) {console.log(err)}
    }

    removeReport = async (id) => {
        try{
            axios.delete(_CONFIG.API_URI+"/api/v1/user/delete_record/" + id,  {
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


    resetToDefault = async() => {
        if(this.state.chosenIndustry !== "Industry" || this.state.projectName !=="Project" ){
          this.setState({
              chosenIndustry: 'Industry',
              projectName: "Project",
              reports: this.state.defaultReports
          });
          return 0;
        }
        this.setState({
            reports: this.state.defaultReports
        })
    };

    checkUndefined = (value) => {
        if(typeof value === 'undefined'){
            return 'none'
        }
        return value;
    }

  render() {
        if(this.state.isLoaded) {
            console.log(this.state.reports);
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

            const saveBtn = <Button variant="primary" onClick={() => {
                this.setState({editBtnClicked: true})
                this.saveEditedFied(this.state.editFieldID)
                }}>
                                        Save
                                        </Button>;
        const importLoadingBtn =  <Button variant="primary" disabled>
            <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            Importing...
        </Button>;

            const importBtn = <Button variant="primary" onClick={() => {
            this.handleFile()
            this.setState({ importBtnClicked: 1 })}
            }>Import</Button>;

            const addBtn = <Button variant="primary" onClick={this.addRecordAndSendToAdmin}>Add Entry</Button>;
                            
            const addLoadingBtn = <Button variant="primary" disabled>
                                        <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        Adding...
                                        </Button>;
            
            const deleteBtn = <Button variant="primary" onClick={() => {
                                    this.setState({
                                        deleteBtnClicked: true
                                    })
                                    this.removeReport(this.state.editFieldID)
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

            const industriesDB = this.state.industries.map( industry => industry);
            const categoriesAndIndustries = [...categories, ...industriesDB];
            


            return(
              <>
            
              {/* delete modal */}
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
            
             {/* edit report modal */}
             <div className="modal-bg" style={{
                    display: this.state.editReportModal
                        }}>
                    <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                        display: this.state.editReportModal
                    }}>
                        <Modal.Header >
                            <Modal.Title>Edit Field</Modal.Title>
                        </Modal.Header>

                        <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                        <Form id="edit-form">
                            <Form.Group controlId="formEditOrganisation">
                                <Form.Label>Organisation</Form.Label>
                                <Form.Control id="edit-organisation" type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.organization)} />
                            </Form.Group>

                            <Form.Group controlId="formEditWebsite">
                                <Form.Label>Website</Form.Label>
                                <Form.Control id="edit-website" type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.website)} />
                            </Form.Group>

                            <Form.Group controlId="formEditContacts">
                                <Form.Label>Contacts</Form.Label>
                                <Form.Control id="edit-contacts" type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.contacts)} />
                            </Form.Group>

                            <Form.Group controlId="formEditContactPerson">
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control id="edit-contactPerson" type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.contactPerson)} />
                            </Form.Group>

                            <Form.Group controlId="formEditTelephone">
                                <Form.Label>Telephone</Form.Label>
                                <Form.Control id="edit-telephone" type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.telephone)} />
                            </Form.Group>

                            <Form.Group controlId="formEditDesignation">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control id="edit-designation" type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.designation)} />
                            </Form.Group>

                            <Form.Group controlId="formEditEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control id="edit-emailAddress" type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.emailAddress)}/>
                            </Form.Group>                       

                            <Form.Group controlId="website">
                                <Form.Label>Physical Location</Form.Label>
                                <Form.Control id="edit-physicalLocation" type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.physicalLocation)}/>
                            </Form.Group>                       
                            <Form.Label>Industry</Form.Label>
                            {/* filter according to sector and subsector */}
                                    <DropdownButton
                                        style={{ marginRight: '1rem', width: '100%'}}
                                        variant="outline-primary"
                                        title={this.state.determinedIndustry}
                                        id="input-group-dropdown-2"
                                        name="industryEdit"
                                        >
                                            {
                                                categoriesAndIndustries.map( category => {
                                                    return(
                                                        <>
                                                        <Dropdown.Item
                                                        key={category.industry}
                                                        style={{width: '70%', margin: '15px' }}
                                                        variant="outline-secondary"
                                                        onClick={() => {this.setState({ determinedIndustry: category.industry})}}
                                                        id="input-group-dropdown-3"
                                                        >
                                                        {category.industry}
                                                       </Dropdown.Item>
                                                    </>
                                                    )}
                                                )}
                                                </DropdownButton>                   
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.toggleEditModalDisplay}>Cancel</Button>
                            {
                                this.state.editBtnClicked < 1 ? saveBtn : saveLoadingBtn
                            }
                        </Modal.Footer>
                        </Modal.Dialog>
                </div>   
            
              {/* add a report */}
                <div className="modal-bg" style={{
                    display: this.state.modalDisplay
                }}>
                <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                    display: this.state.modalDisplay
                }}>
                    <Modal.Header >
                        <Modal.Title>Report Entry</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <Form id="add-form">
                    <Form.Group controlId="formAddProject">
                            <Form.Label>Project Name</Form.Label>
                            <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-secondary"
                                        title={this.state.projectName}
                                        id="input-group-dropdown-7"
                                        >
                                            {
                                                this.state.projects.map( (project, index) => {
                                                    return(
                                                    <Dropdown.Item  key={project._id} className="projects-item" onClick={() => {
                                                        this.setState({
                                                            projectName: project.projectName
                                                        })
                                                    }}>
                                                        {project.projectName}
                                                    </Dropdown.Item>
                                                )
                                            })
                                        }

                                    </DropdownButton> 
                        </Form.Group>  
                        <Form.Group controlId="formAddOrganisation">
                            <Form.Label>Organisation</Form.Label>
                            <Form.Control id="add-organisation" className="add-form-fields" type="textbox" placeholder="Enter organisation" />
                        </Form.Group>

                        <Form.Group controlId="formAddWebsite">
                            <Form.Label>Website</Form.Label>
                            <Form.Control id="add-website" className="add-form-fields" type="textbox" placeholder="Website" />
                        </Form.Group>

                        <Form.Group controlId="formAddContacts">
                            <Form.Label>Contacts</Form.Label>
                            <Form.Control id="add-contacts" className="add-form-fields" type="textbox" placeholder="07000000"/>
                        </Form.Group>

                        <Form.Group controlId="formAddContactPerson">
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control id="add-contact-person" className="add-form-fields" type="textbox" placeholder="Enter name"/>
                        </Form.Group>

                        <Form.Group controlId="formAddTelephone">
                            <Form.Label>Telephone</Form.Label>
                            <Form.Control id="add-telephone" className="add-form-fields" type="textbox" placeholder="0712345678"/>
                        </Form.Group>

                        <Form.Group controlId="formAddDesignation">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control id="add-designation" className="add-form-fields" type="textbox" placeholder="e.g CEO"/>
                        </Form.Group>

                         <Form.Group controlId="formAddEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control id="add-email-address" className="add-form-fields" type="email" placeholder="example@example.com"/>
                        </Form.Group>                       

                        <Form.Group controlId="formAddPhysicalLocation">
                            <Form.Label>PhysicalLocation</Form.Label>
                            <Form.Control id="add-physical-location" className="add-form-fields" type="textbox" placeholder="Enter location"/>
                        </Form.Group>                       

                        <Form.Group controlId="formAddIndustry">
                            <Form.Label>Industry</Form.Label>
                                   {/* filter according to sector and subsector */}
                                    <DropdownButton
                                        style={{ marginRight: '1rem', width: '100%'}}
                                        variant="outline-primary"
                                        title={this.state.chosenIndustry}
                                        id="input-group-dropdown-21"
                                        >
                                            {
                                                categoriesAndIndustries.map( category => {
                                                    return(
                                                        <>
                                                        <Dropdown.Item
                                                        key={category.industry}
                                                        style={{width: '70%', margin: '15px' }}
                                                        variant="outline-secondary"
                                                        onClick={() => {this.setState({ determinedIndustry: category.industry})}}
                                                        id="input-group-dropdown-31"
                                                        >
                                                            {category.industry}
                                                     
                                                    </Dropdown.Item>
                                                    </>
                                                    )}
                                                )}
                                                </DropdownButton>                   
                        </Form.Group>                       
                      </Form>
                    </Modal.Body>
                    <small style={{color: 'red', margin: '15px'}} id="add-form-warning"></small>
                    <br/>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleModalDisplay}>Close</Button>
                        {
                            this.state.addBtnClicked < 1 ? addBtn : addLoadingBtn
                        }
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>
                
                {/* bulk email modal */}
                <div className="modal-bg" style={{
                    display: this.state.emailModal
                }}>
                <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                    display: this.state.emailModal
                }}>
                    <Modal.Header >
                        <Modal.Title>Send Bulk Email</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <Form>
                        <Form.Group controlId="formCompanyName">
                            <Form.Label>Recipients</Form.Label>
                            <div style={{display: 'flex'}}>
                           <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-secondary"
                                        title="Industry"
                                        id="input-group-dropdown-12"
                                        >
                                            {
                                                categoriesAndIndustries.map( category => {
                                                    return(
                                                        <>
                                                        <DropdownButton
                                                        key={category.industry}
                                                        style={{width: '70%', margin: '15px'}}
                                                        variant="outline-secondary"
                                                        title={category.industry}
                                                        id="input-group-dropdown-102"
                                                        >

                                                    </DropdownButton>

                                                    </>
                                                    )
                                                })
                                            }

                                    </DropdownButton>

                                    <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-secondary"
                                        title="Project"
                                        id="input-group-dropdown-104"
                                        >
                                            {
                                                this.state.projects.map(project => {
                                                    return(
                                                        <Dropdown.Item key={project._id} onClick={() => {
                                                            this.setState({
                                                                reports: this.state.reports.filter(report => report.projectName === project.projectName)
                                                            });
                                                        }}>{project.projectName}</Dropdown.Item>
                                                    )
                                                })
                                            }

                                    </DropdownButton>
                           </div>
                        </Form.Group>

                        <Form.Group controlId="formContactPerson">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control type="textbox" placeholder="e.g Welcome to B2B Africa"/>
                        </Form.Group>

                        <Form.Group controlId="formPosition">
                            <Form.Label>Body</Form.Label>
                            <Form.Control as="textarea" rows="4" placeholder="Enter message..."/>
                        </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleEmailModalDisplay}>Cancel</Button>
                        <Button variant="primary">Send Email</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>


                {/* send individual email */}
                <div className="modal-bg" style={{
                    display: this.state.individualEmailModule
                }}>
                    <Modal.Dialog>    
                    <Modal.Header >
                        <Modal.Title>Send Individual Email</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <Form>
                        <Form.Group controlId="formContactPerson">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control type="textbox" placeholder="e.g Welcome to B2B Africa"/>
                        </Form.Group>

                        <Form.Group controlId="formPosition">
                            <Form.Label>Body</Form.Label>
                            <Form.Control as="textarea" rows="4" placeholder="Enter message..."/>
                        </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleIndividualEmailModalDisplay}>Cancel</Button>
                        <Button variant="primary">Send Email</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>

                {/* add comment to report modal*/}
                <div className="modal-bg" style={{
                    display: this.state.commentModal
                }}>
                <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                    display: this.state.commentModal
                }}>
                    <Modal.Header >
                        <Modal.Title>Comments</Modal.Title>
                    </Modal.Header>
                    <ul style={{marginTop: '1.25rem'}}>
                    {
                        this.state.reports.filter( report => report._id === this.state.editFieldID ).map(report => {
                            return(
                                <li>{report.comments}</li>
                            )
                        } )
                    }
                    </ul>
                   
                    <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <Form>
                        <Form.Group controlId="formComment">
                            <Form.Control as="textarea" rows="4" id="comment-field" placeholder="Add a comment..."/>
                        </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleCommentModalDisplay}>Cancel</Button>
                        <Button variant="primary" onClick={ () => {this.addComment(this.state.editFieldID)}}>{this.state.addCommentBtnClicked ? 'loading...' : 'Comment'}</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>

     

                {/* import file modal */}
                <div className="modal-bg" style={{
                    display: this.state.importFileModal
                }}>
                <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                    display: this.state.importFileModal
                }}>
                    <Modal.Header >
                        <Modal.Title>Choose file to import</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <label for="avatar">Choose a file:</label>

                        <input type="file"
                            id="avatar" name="avatar"
                            accept={SheetJSFT}
                            onChange={this.handleChange} 
                            />
                            <br />
                        <small style={{color: 'red'}}>
                         File should be of .xlsx type.
                        </small>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleImportModalDisplay}>Cancel</Button>
                       {
                           this.state.importBtnClicked < 1 ? importBtn : importLoadingBtn
                       }
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>

                <div className="container">
                <div style={{width: '100%', display: 'flex',  justifyContent: 'space-between', alignItems: 'center'}}>
                        <h2 style={{fontWeight: 'bold'}} >Database  <span style={{fontSize: '18px'}}>(Total: {this.state.reports.length} records)</span></h2>
                        <Search handleInput={this.handleSearch} searchInput={this.state.searchInput} handleSearchInput={this.handleSearchInput} />
                    </div>
                    <Nav variant="pills" defaultActiveKey="#" className="navigation-tab-menu" style={{position: 'absolute', left:' 50px'}}>
                        <Nav.Item onClick={this.toggleModalDisplay}>
                            <Nav.Link href="#">Add entry</Nav.Link>
                        </Nav.Item>

                       
                        <Nav.Item onClick={this.toggleEmailModalDisplay}>
                           <Nav.Link eventKey="link-6" href="#">
                           Send bulk email                            
                               </Nav.Link> 
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link style={{ display: 'flex'}} >
                                <span style={{ marginRight: '1rem' }}>Filter:</span>

                                   {/* filter according to sector and subsector */}
                                    <DropdownButton
                                        style={{ marginRight: '1rem', width: '100%'}}
                                        variant="outline-primary"
                                        title={this.state.chosenIndustry}
                                        id="input-group-dropdown-2"
                                        >
                                            {
                                                categoriesAndIndustries.map( category => {
                                                    return(
                                                        <>
                                                        <Dropdown.Item
                                                        key={category.industry}
                                                        style={{width: '70%', margin: '15px' }}
                                                        variant="outline-secondary"
                                                        title={category.industry}
                                                        id="input-group-dropdown-3"
                                                        onClick={() => {
                                                            this.setState({
                                                                chosenIndustry: category.industry
                                                            })
                                                        }}
                                                        >
                                                            {category.industry}
                                                    </Dropdown.Item>

                                                    </>
                                                    )
                                                })
                                            }
                                    </DropdownButton>

                                    {/* filter according to Project*/}
                                    <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-primary"
                                        title={this.state.projectName}
                                        id="input-group-dropdown-4"
                                        >
                                            {
                                                this.state.projects.map(project => {
                                                    return(
                                                        <Dropdown.Item key={project._id} onClick={() => {
                                                            this.setState({
                                                                reports: this.state.reports.filter(report => report.projectName === project.projectName),
                                                                projectName: project.projectName
                                                            });
                                                        }}>{project.projectName}</Dropdown.Item>
                                                    )
                                                })
                                            }

                                    </DropdownButton>

                                    <Button 
                                        style={{
                                            display: this.state.chosenIndustry === 'Industry' && this.state.projectName === 'Project' ? 'none' : 'block'
                                        }}

                                        onClick={() => {
                                            this.resetToDefault();
                                            }}>
                                    Reset
                                </Button>

                            </Nav.Link>
                        </Nav.Item>


                       

                        </Nav>
                    <section className="section-container"> 
                    <Table variant='dark' className="reports-table" style={{marginTop: '30px'}} striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Organisation</th>
                                <th>Website</th>
                                <th>Contacts</th>
                                <th>Contact Person</th>
                                <th>Telephone</th>
                                <th>Designation</th>
                                <th>Email Address</th>
                                <th>Physical Location</th>
                                <th>Industry</th>
                                <th>Project</th>
                                <th>Date Updated</th>
                                <th>Confirmed</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {
                                this.state.reports.filter(report => report.submittedBy === this.props.userLoggedIn || this.checkUndefined(report.assignedTo) === this.props.userLoggedIn).map((user,index) => {
                                    return(
                                    <>
                                        <div
                                        key={user.password} 
                                        className="delete-icon" 
                                        style={{ 
                                                 position: 'absolute',
                                                 left: '-135px',
                                                 width: 'fit-content',
                                                 height: 'fit-content'
                                                }}
                                        onClick={() => {
                                            window.scrollTo(0, 0); 
                                            this.setState({
                                                editFieldID: user._id,
                                                editFieldIndex: index
                                            });
                                                    this.toggleCommentModalDisplay();
                                                    }}        
                                                >
                                          <div style={{ display: typeof user.comments === "undefined" ? 'none' : 'block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'red'}}></div>
                                          <img   src={comment}   
                                                style={{width: '20px', 
                                                        height: '20px'
                                                }}/> 

                                    </div>

                                     <img  key={user} src={tick} style={{marginLeft: '-35px'}} className="delete-icon" onClick={() => {
                                          window.scrollTo(0, 0);
                                        this.setState({
                                            editFieldID: user._id
                                        });
                                        if(user.confirmed) {
                                            alert('This record is already confirmed');
                                            return 0;
                                        }
                                        this.markComplete(user._id);
                                    }}/>

                                     <img  key={user.password} src={edit} style={{marginLeft: '-5px'}} className="delete-icon" onClick={() => {
                                         window.scrollTo(0, 0);
                                        this.setState({
                                            editFieldID: user._id
                                        });
                                        this.toggleEditModalDisplay()
                                    }}/>
                                        <tr key={index} className="user-rows"  onClick={this.toggleIndividualEmailModalDisplay}>
                                        <td>{index+1}</td>
                                        <td>{this.state.editSave === 'none' ? user.organization : this.returnEditFields(user.organization)}</td>
                                        <td>{this.state.editSave === 'none' ? user.website : this.returnEditFields(user.website)}</td>
                                        <td>{this.state.editSave === 'none' ? user.contacts : this.returnEditFields(user.contacts)}</td>
                                        <td>{this.state.editSave === 'none' ? user.contactPerson : this.returnEditFields(user.contactPerson)}</td>
                                        <td>{this.state.editSave === 'none' ? user.telephone : this.returnEditFields(user.telephone)}</td>
                                        <td>{this.state.editSave === 'none' ? user.designation : this.returnEditFields(user.designation)}</td>
                                        <td>{this.state.editSave === 'none' ? user.emailAddress : this.returnEditFields(user.emailAddress)}</td>
                                        <td>{this.state.editSave === 'none' ? user.physicalLocation : this.returnEditFields(user.physicalLocation)}</td>
                                        <td>{this.state.editSave === 'none' ? user.industry : this.returnEditFields(user.industry)}</td>
                                        <td>{this.state.editSave === 'none' ? user.project : this.returnEditFields(user.project)}</td>
                                        <td>{this.state.editSave === 'none' ? user.collectionDate : this.returnEditFields(user.collectionDate)}</td>
                                        <td>{ user.confirmed ? 'Confirmed' : 'Pending'}</td>
                                        </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                        </Table>
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