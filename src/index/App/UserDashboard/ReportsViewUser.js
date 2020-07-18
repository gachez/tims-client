import React from 'react';
import '../shared/ReportsView.css';
import {Spinner,Table, Nav, Modal, Form, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import trash from '../Dashboard/shared/trash.png';
import tick from '../shared/tick.png';
import axios from 'axios';
import edit from '../shared/edit.png';
import XLSX from 'xlsx';
import { categories } from '../shared/lib/categories';
import { make_cols } from '../Dashboard/MakeColumns';
import { SheetJSFT } from '../Dashboard/types';

 

export default class ReportsViewUser extends React.Component{

    state = {
        modalDisplay: 'none',
        editSave: 'none',
        isLoaded: false,
        emailModal: 'none',
        editReportModal: 'none',
        sendAdminModal: 'none',
        importFileModal: 'none',
        reports: [], 
        editFieldID: '',
        editBtnClicked: false,
        addBtnClicked: false,
        deleteModalDisplay: 'none',
        deleteBtnClicked: false,
        chosenIndustry: 'Industry',
        projectName: 'Project',
        projects: [],
        individualEmailModule: 'none',
        importBtnClicked: false,
        determinedIndustry: '',
        industries: []
    }

    componentDidMount() {
        axios.get("https://a123ef.df.r.appspot.com/api/v1/admin/get_reports",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {

            this.setState({
                reports: res.data,
                isLoaded: true
            });
          });

          axios.get('https://a123ef.df.r.appspot.com/api/v1/admin/get_industries',{
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
              this.setState({
                  industries: res.data
              })
          })

          axios.get("https://a123ef.df.r.appspot.com/api/v1/admin/get_projects",  {
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

    getEditField = (id ) => {
        const field = this.state.reports.filter(report => report._id === id);
        return field;

    }
 
    markComplete = (id) => {
        console.log('..marking')
        axios.post(`https://a123ef.df.r.appspot.com/api/v1/admin/edit_record/${id}`, {
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
        console.log('saving...')
        this.setState({
            editBtnClicked: 1
        })
       try{

        const edits = await Array.from(document.getElementById('edit-form')).map(node => node)
       
        const saveEdits = {
            companyName:  edits[0].value.length < 1 ? edits[0].getAttribute('placeholder') : edits[0].value, 
            contactPerson: edits[1].value.length < 1 ? edits[1].getAttribute('placeholder') : edits[1].value,
            position:   edits[2].value.length < 1 ? edits[2].getAttribute('placeholder') : edits[2].value,
            email1:    edits[3].value.length < 1 ? edits[3].getAttribute('placeholder') : edits[3].value,
            email2:   edits[4].value.length < 1 ? edits[4].getAttribute('placeholder') : edits[4].value,
            mobile1:   edits[5].value.length < 1 ? edits[5].getAttribute('placeholder') : edits[5].value,
            mobile2:   edits[6].value.length < 1 ? edits[6].getAttribute('placeholder'): edits[6].value,
            website: edits[7].value.length < 1 ? edits[7].getAttribute('placeholder') : edits[7].value,
            industry: this.state.chosenIndustry,
            productDescription: edits[9].value.length < 1 ? edits[9].getAttribute('placeholder') : edits[9].value,
            country: edits[10].value.length < 1 ? edits[10].getAttribute('placeholder') : edits[10].value,
            collectionDate: new Date(),
            collectionTime: new Date(),
            submittedBy: this.props.userLoggedIn
        }

        // console.log(saveEdits)
        axios.post(`https://a123ef.df.r.appspot.com/api/v1/admin/edit_record/${id}`, saveEdits, {
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
                      
            const edits = Array.from(document.getElementById('add-form')).map(node => node);
            const fields = Array.from(document.getElementsByClassName('add-form-fields')).map(field => {
                                 return field
                             });
            const emptyFields = fields.filter(field => field.value.length < 1 );
            
            if(emptyFields.length > 0){
                document.getElementById('add-form-warning').textContent="Please fill all fields before submitting";
                emptyFields.forEach( field => {
                    field.style.border = "solid 1px red"
                });
             return;
            }
            this.setState({
                addBtnClicked: true
                 });
               
            const savedReport = {
                companyName:  fields[0].value, 
                contactPerson: fields[1].value,
                position:   fields[2].value,
                email1:    fields[3].value,
                email2:   fields[4].value,
                mobile1:   fields[5].value,
                mobile2:   fields[6].value,
                website: fields[7].value,
                industry: this.state.determinedIndustry,
                subSector: this.state.chosenIndustry,
                productDescription: fields[8].value,
                country: fields[9].value,
                collectionDate: new Date(),
                collectionTime: new Date(),
                submittedBy: this.props.userLoggedIn,
                projectName: this.state.projectName
            }
        console.log(savedReport)
        try{
            axios.post("https://a123ef.df.r.appspot.com/api/v1/user/add_record", savedReport, {
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
        const fields = Array.from(document.getElementsByClassName('add-form-fields')).map(field => {
            return field
        });
        try{
            const savedReport = {
                companyName:  fields[0].value, 
                contactPerson: fields[1].value,
                position:   fields[2].value,
                email1:    fields[3].value,
                email2:   fields[4].value,
                mobile1:   fields[5].value,
                mobile2:   fields[6].value,
                website: fields[7].value,
                industry: this.state.determinedIndustry,
                subSector: this.state.chosenIndustry,
                productDescription: fields[8].value,
                country: fields[9].value,
                collectionDate: new Date(),
                collectionTime: new Date(),
                submittedBy: this.props.userLoggedIn,
                projectName: this.state.projectName
            }

            this.sendToAdmin(savedReport);

        } catch(err) {console.log(err)}
    }

    sendToAdmin = (data) => {
                      //post to admin reports database
                      axios.post("https://a123ef.df.r.appspot.com/api/v1/admin/add_record", data, {
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
        axios.post("https://a123ef.df.r.appspot.com/api/v1/user/edit_record/" + id, {
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
            axios.post("https://a123ef.df.r.appspot.com/api/v1/admin/add_record", {
                companyName:  report.companyName, 
                contactPerson: report.contactPerson,
                position:   report.position,
                email1:   report.email1,
                email2:   report.email2,
                mobile1:   report.mobile1,
                mobile2:   report.mobile2,
                website: report.website,
                industry: report.industry,
                subSector: !report.subSector ? "N/A" : report.subSector,
                productDescription: report.productDescription,
                country: report.country,
                collectionDate: new Date(),
                collectionTime: new Date(),
                submittedBy: this.props.userLoggedIn,
                confirmed: report.confirmed,
                event: report.projectName
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

    removeReport = async (id) => {
        try{
            axios.delete("https://a123ef.df.r.appspot.com/api/v1/user/delete_record/" + id,  {
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

            const importBtn =  <Button variant="primary" onClick={() => {
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

            const userReports = this.state.reports.filter(report => report.submittedBy.toLowerCase() === this.props.userLoggedIn.toLowerCase());
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
                            <Form.Group controlId="formCompanyName">
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.companyName)} />
                            </Form.Group>

                            <Form.Group controlId="formContactPerson">
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.contactPerson)} />
                            </Form.Group>

                            <Form.Group controlId="formPosition">
                                <Form.Label>Position</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.position)} />
                            </Form.Group>

                            <Form.Group controlId="email1">
                                <Form.Label>Email 1</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.email1)} />
                            </Form.Group>

                            <Form.Group controlId="email2">
                                <Form.Label>Email 2</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.email2)} />
                            </Form.Group>

                            <Form.Group controlId="mobile1">
                                <Form.Label>Mobile 1</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.mobile1)} />
                            </Form.Group>

                            <Form.Group controlId="mobile2">
                                <Form.Label>Mobile 2</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.mobile2)}/>
                            </Form.Group>                       

                            <Form.Group controlId="website">
                                <Form.Label>Website</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.website)}/>
                            </Form.Group>                       
                            <Form.Label>Industry</Form.Label>
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
                                                        <DropdownButton
                                                        key={category.industry}
                                                        style={{width: '70%', margin: '15px' }}
                                                        variant="outline-secondary"
                                                        onClick={() => {this.setState({ determinedIndustry: category.industry})}}
                                                        title={category.industry}
                                                        id="input-group-dropdown-3"
                                                        >

                                                        <div style={{maxHeight: '350px', overflowY: 'scroll'}}>
                                                        {
                                                                Array.isArray(category.subSector) ? 
                                                                category.subSector.map( subsector => {
                                                                    return(
                                                                      <Dropdown.Item key={subsector} 
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                chosenIndustry: subsector,
                                                                                reports: this.state.reports.filter(report => report.industry === subsector)
                                                                            })
                                                                        }}
                                                                      >{subsector}</Dropdown.Item>
                                                        )
                                                                }) :   category.subSector.split(",").map( subsector => {
                                                                    return(
                                                                      <Dropdown.Item key={subsector} 
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                chosenIndustry: subsector,
                                                                                reports: this.state.reports.filter(report => report.industry === subsector)
                                                                            })
                                                                        }}
                                                                      >{subsector}</Dropdown.Item>
                                                        )
                                                                })
                                                            }

                                                                    </div>
                                                    </DropdownButton>
                                                    </>
                                                    )}
                                                )}
                                                </DropdownButton>                   

                            <Form.Group controlId="productDescription">
                                <Form.Label>Product Description</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.productDescription)}/>
                            </Form.Group>                       

                            <Form.Group controlId="country">
                                <Form.Label>Country</Form.Label>
                                <Form.Control type="textbox" placeholder={this.getEditField(this.state.editFieldID).map(field => field.country)}/>
                            </Form.Group>                       


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
                    <Form.Group controlId="projectName">
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
                        <Form.Group controlId="formCompanyName">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="Enter name" />
                        </Form.Group>

                        <Form.Group controlId="formContactPerson">
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="Contact Person"/>
                        </Form.Group>

                        <Form.Group controlId="formPosition">
                            <Form.Label>Position</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="Position"/>
                        </Form.Group>

                        <Form.Group controlId="email1">
                            <Form.Label>Email 1</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="example@example.com"/>
                        </Form.Group>

                        <Form.Group controlId="email2">
                            <Form.Label>Email 2</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="example@example.com"/>
                        </Form.Group>

                        <Form.Group controlId="mobile1">
                            <Form.Label>Mobile 1</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="07000000"/>
                        </Form.Group>

                         <Form.Group controlId="mobile2">
                            <Form.Label>Mobile 2</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="0700000"/>
                        </Form.Group>                       

                        <Form.Group controlId="website">
                            <Form.Label>Website</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="www.example.com"/>
                        </Form.Group>                       

                        <Form.Group controlId="industry">
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
                                                        <DropdownButton
                                                        key={category.industry}
                                                        style={{width: '70%', margin: '15px' }}
                                                        variant="outline-secondary"
                                                        onClick={() => {this.setState({ determinedIndustry: category.industry})}}
                                                        title={category.industry}
                                                        id="input-group-dropdown-31"
                                                        >

                                                        <div style={{maxHeight: '350px', overflowY: 'scroll'}}>
                                                        {
                                                                Array.isArray(category.subSector) ? 
                                                                category.subSector.map( subsector => {
                                                                    return(
                                                                      <Dropdown.Item key={subsector} 
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                chosenIndustry: subsector,
                                                                                reports: this.state.reports.filter(report => report.industry === subsector)
                                                                            })
                                                                        }}
                                                                      >{subsector}</Dropdown.Item>
                                                        )
                                                                }) :   category.subSector.split(",").map( subsector => {
                                                                    return(
                                                                      <Dropdown.Item key={subsector} 
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                chosenIndustry: subsector,
                                                                                reports: this.state.reports.filter(report => report.industry === subsector)
                                                                            })
                                                                        }}
                                                                      >{subsector}</Dropdown.Item>
                                                        )
                                                                })
                                                            }

                                                                    </div>
                                                    </DropdownButton>
                                                    </>
                                                    )}
                                                )}
                                                </DropdownButton>                   

                        </Form.Group>                       

                        <Form.Group controlId="productDescription">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="e.g supplies"/>
                        </Form.Group>                       

                        <Form.Group controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Control className="add-form-fields" type="textbox" placeholder="e.g Kenya"/>
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

                                                        <div style={{maxHeight: '350px', overflowY: 'scroll'}}>
                                                        {
                                                                Array.isArray(category.subSector) ? 
                                                                category.subSector.map( subsector => {
                                                                    return(
                                                                      <Dropdown.Item key={subsector} 
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                chosenIndustry: subsector,
                                                                                reports: this.state.reports.filter(report => report.industry === subsector)
                                                                            })
                                                                        }}
                                                                      >{subsector}</Dropdown.Item>
                                                        )
                                                                }) :   category.subSector.split(",").map( subsector => {
                                                                    return(
                                                                      <Dropdown.Item key={subsector} 
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                chosenIndustry: subsector,
                                                                                reports: this.state.reports.filter(report => report.industry === subsector)
                                                                            })
                                                                        }}
                                                                      >{subsector}</Dropdown.Item>
                                                        )
                                                                })
                                                            }

                                                                    </div>
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
                    <h2 id="h2-title">Reports</h2>
                    <Nav variant="pills" defaultActiveKey="#" className="navigation-tab-menu" style={{position: 'absolute', left:' 50px'}}>
                        <Nav.Item onClick={this.toggleModalDisplay}>
                            <Nav.Link href="#">Add report</Nav.Link>
                        </Nav.Item>

                       
                        <Nav.Item onClick={this.toggleEmailModalDisplay}>
                           <Nav.Link eventKey="link-6" href="#">
                           Send bulk email                            
                               </Nav.Link> 
   
                        </Nav.Item>

                       

                        </Nav>
                    <section className="section-container"> 
                    <Table variant='dark' className="reports-table" style={{marginTop: '30px'}} striped bordered hover responsive>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Project Name</th>
                            <th>Company Name</th>
                            <th>Contact Person</th>
                            <th>Position</th>
                            <th>Email 1</th>
                            <th>Email 2</th>
                            <th>Mobile 1</th>
                            <th>Mobile 2</th>
                            <th>Website</th>
                            <th>Industry</th>
                            <th>Subsector</th>
                            <th>Product Description</th>
                            <th>Country</th>
                            <th>Date Updated</th>
                            <th>Confirmed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.reports.filter(report => report.submittedBy.toLowerCase() === this.props.userLoggedIn.toLowerCase()).map((user,index) => {
                                    return(<>
                                     <img  key={user} src={tick} style={{marginLeft: '-35px'}} className="delete-icon" onClick={() => {
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
                                        this.setState({
                                            editFieldID: user._id
                                        });
                                        this.toggleEditModalDisplay()
                                    }}/>
                               
                                 
                                        <tr key={index} className="user-rows"  onClick={this.toggleIndividualEmailModalDisplay}>
                                        <td>{index}</td>
                                        <td>{this.state.editSave === 'none' ? user.projectName : this.returnEditFields(user.projectName)}</td>
                                        <td>{this.state.editSave === 'none' ? user.companyName : this.returnEditFields(user.companyName)}</td>
                                        <td>{this.state.editSave === 'none' ? user.contactPerson : this.returnEditFields(user.contactPerson)}</td>
                                        <td>{this.state.editSave === 'none' ? user.position : this.returnEditFields(user.position)}</td>
                                        <td>{this.state.editSave === 'none' ? user.email1 : this.returnEditFields(user.email1)}</td>
                                        <td>{this.state.editSave === 'none' ? user.email2 : this.returnEditFields(user.email2)}</td>
                                        <td>{this.state.editSave === 'none' ? user.mobile1 : this.returnEditFields(user.mobile1)}</td>
                                        <td>{this.state.editSave === 'none' ? user.mobile2 : this.returnEditFields(user.mobile2)}</td>
                                        <td>{this.state.editSave === 'none' ? user.website : this.returnEditFields(user.website)}</td>
                                        <td>{this.state.editSave === 'none' ? user.industry : this.returnEditFields(user.industry)}</td>
                                        <td>{this.state.editSave === 'none' ? user.subSector : this.returnEditFields(user.subSector)}</td>
                                        <td>{this.state.editSave === 'none' ? user.productDescription : this.returnEditFields(user.productDescription)}</td>
                                        <td>{this.state.editSave === 'none' ? user.country : this.returnEditFields(user.country)}</td>
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