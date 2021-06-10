import React from 'react';
import '../shared/ReportsView.css';
import {Spinner,Table, Nav, Dropdown, DropdownButton,Modal, Form, Button} from 'react-bootstrap';
import trash from './shared/trash.png';
import edit from '../shared/edit.png';
import comment from '../shared/chatbox.png';
import excel from '../shared/excelicon.png';
import axios from 'axios';
import 'react-dropzone-uploader/dist/styles.css';
import {categories} from '../shared/lib/categories';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import DropdownItem from 'react-bootstrap/DropdownItem';
import _CONFIG from '../../../config/config';



export default class ReportsView extends React.Component{

    state = {
        editSave: 'none',
        users: [],
        isLoaded: false,
        commentModal: 'none',
        emailModal: 'none',
        individualEmailModule: 'none',
        reports: [],
        importFileModal: 'none',
        exportFileModal: 'none',
        editReportModal: 'none',
        addModalDisplay: 'none',
        importBtnClicked: 0,
        exportbtnClicked: 0,
        saveBtnClicked: 0,
        editBtnClicked: 0,
        emailBtnClicked: 0,
        addBtnClicked: 0,
        deleteBtnClicked: false,
        industryBtnClicked: false,
        commentBtnClicked: false,
        editFieldID: '',
        editFieldIndex: 0,
        deleteModalDisplay: 'none',
        chosenUser: 'User',
        chosenIndustry: 'Industry',
        selectedFile: null,
        file: {},
        data: [],
        cols: [],
        subSector: '',
        industry: 'Industry',
        projects: [],
        projectName: 'Project',
        categoryModal: 'none',
        industries: [],
        determinedIndustry: '',
        defaultReports: [],
        industryFilterClicked: 0,
        projectFilterClicked: 0,
        userFilterClicked: 0,
        status: 'Status'
        
    }

    componentDidMount() {
        axios.get(_CONFIG.API_URI+"/api/v1/admin/get_reports", {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
              this.setState({
                  isLoaded: true,
                  reports: res.data,
                  defaultReports: res.data.reverse()
              })
              
          }).catch(err => console.log(err));

          axios.get(_CONFIG.API_URI+'/api/v1/admin/get_industries',{
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
              this.setState({
                  industries: res.data
              })
          })

          axios.get(_CONFIG.API_URI+'/api/v1/admin/get_users', {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          })
        .then(res => {
            this.setState({
                users: res.data
            });
        }).catch(err => {
            console.log('error getting users' + err)
        })

        axios.get(_CONFIG.API_URI+'/api/v1/admin/get_projects', {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          })
        .then(res => {
            this.setState({
                projects: res.data
            });
        }).catch(err => {
            console.log('error getting users' + err)
        });

        localStorage.setItem("page", "database");  
    }

    

    onEditClick = () => {
        this.setState({
            navigation: 'edit'
        }, () => {
            this.toggleSave();
        })

    }


    toggleEmailModalDisplay = () => {
        this.state.emailModal === 'none' ? this.setState({emailModal: 'block'}) : this.setState({emailModal: 'none'})
        
    }

    toggleIndividualEmailModalDisplay = () => {
        this.state.individualEmailModule === 'none' ? this.setState({individualEmailModule: 'block'}) : this.setState({individualEmailModule: 'none'})
        
    }

    toggleImportModalDisplay = () => {
        this.state.importFileModal === 'none' ? this.setState({importFileModal: 'block'}) : this.setState({importFileModal: 'none', importBtnClicked: 0})
        
    }

    toggleExportModalDisplay = () => {
        this.state.exportFileModal === 'none' ? this.setState({exportFileModal: 'block'}) : this.setState({exportFileModal: 'none', exportbtnClicked: 0})
        
    }

    toggleEditModalDisplay = () => {
        this.state.editReportModal === 'none' ? this.setState({editReportModal: 'block'}) : this.setState({editReportModal: 'none'})

    }

    toggleIndstryModalDisplay = () => {
        this.state.categoryModal === 'none' ? this.setState({categoryModal: 'block'}) : this.setState({categoryModal: 'none'})
    }

    toggleAddModalDisplay = () => {
        this.state.addModalDisplay === 'none' ? this.setState({addModalDisplay: 'block'}) : this.setState({addModalDisplay: 'none'})

    }

    toggleDeleteModal = () => {
        this.state.deleteModalDisplay === 'none' ? this.setState({deleteModalDisplay: 'block'}) : this.setState({deleteModalDisplay: 'none'})
    }

    toggleCommentModalDisplay = () => {
        this.state.commentModal === 'none' ? this.setState({commentModal: 'block'}) : this.setState({commentModal: 'none'})
    }


    getEditField = (id ) => {
        return this.state.reports.filter(report => report._id === id);
    }

    saveEditedFied = async (id) => {
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
            industry: edits[8].value.length < 1 ? edits[8].getAttribute('placeholder') : edits[8].value,
            productDescription: edits[9].value.length < 1 ? edits[9].getAttribute('placeholder') : edits[9].value,
            country: edits[10].value.length < 1 ? edits[10].getAttribute('placeholder') : edits[10].value,
            collectionDate: new Date(),
            collectionTime: new Date(),
            submittedBy: 'admin'
        }

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

    addComment = async (id) => {
        try{

            const comments = await document.getElementById('comment-field').value;

            // added comments
            axios.post(`${_CONFIG.API_URI}/api/v1/admin/edit_record/${id}`, {comments: comments}, {
                headers: {
                    'auth-token': `${localStorage.getItem('auth-token')}`
                  }
            }).then(res => {
                alert("Succesfully added comment");     
                    console.log(res);
                    this.toggleCommentModalDisplay();
                    this.reloadPage();
            }).catch(err => console.log(err))
    
        } catch(err) {console.log(err)}
    }

    getAddEntryFormValues = async () => {
        const edits = await Array.from(document.getElementById('add-form')).map(node => node);

        return {
            projectName: this.state.projectName,
            companyName: edits[1].value, 
            contactPerson: edits[2].value,
            position: edits[3].value,
            email1: edits[4].value,
            email2: edits[5].value,
            mobile1: edits[6].value,
            mobile2: edits[7].value,
            website: edits[8].value,
            industry: this.state.determinedIndustry,
            subSector: this.state.chosenIndustry,
            productDescription: document.getElementsByName("productdescription")[0].value,
            country: document.getElementsByName("country")[0].value,
            collectionDate: new Date().toUTCString(),
            collectionTime: new Date().toUTCString(),
            submittedBy: 'admin'
        }
    }

    addReport = async (savedReport) => {
  
        const toSave = await savedReport;
        try{
            axios.post(_CONFIG.API_URI+"/api/v1/admin/add_record", toSave, {
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
        } catch(err) {console.log('error' + err)}

    }

    removeUser = async (id) => {
        try{
            axios.delete(_CONFIG.API_URI+"/api/v1/admin/delete_record/" + id,  {
                headers: {
                'auth-token': `${localStorage.getItem('auth-token')}`
                }
            })
            .then(res => {
                console.log('succesfully deleted record ' + res)
                alert('Succesfully deleted record');
                this.toggleDeleteModal();
                this.reloadPage();
            })
        } catch (err) {console.log('sorry ' + err)}
    }


    reloadPage = () => {

        window.location.reload()
    }


    downloadExcel = () => {
        this.setState({
            exportbtnClicked: 1
        })
        axios.post(_CONFIG.API_URI+"/api/v1/export_excel", this.state.reports,
           {  
               headers: {
                        'auth-token': `${localStorage.getItem('auth-token')}`
                    },
            responseType: 'blob', // important
          }).then((response) => {
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', 'database.xlsx'); //or any other extension
             document.body.appendChild(link);
             link.click();
             this.setState({
                 exportbtnClicked: 0,
             });
             this.toggleExportModalDisplay();
          }).catch((err) => {
              console.log('oops: ' + err)
          })
    }

  
    
    handleChange = (e) => {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
      };
     
      handleFile = async () => {
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
                data: data
             },
              () => {
                var dataArr = []
                console.log(this.state.data.length)
                  this.state.data.forEach( (imports,index) => {
                     let dataObj = {    
                        organization: imports['ORGANISATION'],
                        website: imports['WEBSITE '], 
                        contacts: imports['CONTACTS'],
                        contactPerson: imports['CONTACT PERSON'],
                        telephone: imports['TELEPHONE'],
                        designation: imports['DESIGNATION'],
                        emailAddress: imports['EMAIL ADDRESS'],
                        physicalLocation: imports[' Physical Location'],
                        industry: !imports['INDUSTRY'] ? wsname : imports['INDUSTRY'],
                        collectionDate: new Date().toUTCString(),
                        collectionTime: new Date().toUTCString(),
                        submittedBy: 'admin'
                    }; 
                    dataArr.push(dataObj)
                });
                console.log(dataArr)
                for(let dataOb of dataArr){
                    try{
                        fetch(_CONFIG.API_URI+"/api/v1/admin/add_record", {
                            method: 'POST', 
                            headers: {
                                'Content-Type': 'application/json',
                                'auth-token': `${localStorage.getItem('auth-token')}`
                            },
                            body: JSON.stringify(dataOb),
                            })
                            .then(response => response.json())
                            .then(dat => {
                            console.log('Success uploaded record:', dat);
                            })
                            .catch((error) => {
                            console.error('Error:', error);
                            });
                    } catch(err) {
                        console.log(err)
                        break
                    }
                    
                }
                alert('Succesfully imported file data');
                this.reloadPage()
               
            });
        };
     
        if (rABS) {
          reader.readAsBinaryString(this.state.file);
        } else {
          reader.readAsArrayBuffer(this.state.file);
        }
      }

      resetToDefault = async() => {
          if(this.state.chosenIndustry !== "Industry" || this.state.projectName !=="Project" || this.state.chosenUser !== "User" ){
            this.setState({
                chosenIndustry: 'Industry',
                projectName: "Project",
                chosenUser: "User",
                reports: this.state.defaultReports
            });
            return 0;
          }
          this.setState({
              reports: this.state.defaultReports
          })
      }
    render() {
        if(this.state.isLoaded) {
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
           
        const exportBtn =  <Button variant="primary" onClick={() => {
            this.downloadExcel();
            
            // then(res => {

                
            //     console.log(res)
            //     alert('Succesfully downloaded excel file');
            //     this.setState({ exportbtnClicked: 1 })
            //     this.toggleExportModalDisplay();
            // })
        }
    
            
            }>Export</Button>;
        const exportLoadingBtn =  <Button variant="primary" disabled>
                                        <Spinner
                                            as="span"
                                            animation="grow"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        Exporting...
                                    </Button>;

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
            this.saveEditedFied(this.state.editFieldID)
            }}>
            Save
            </Button>;
            
        const addBtn = <Button variant="primary" onClick={() => {
            this.setState({
                addBtnClicked: 1
            })
            this.addReport(this.getAddEntryFormValues())
        }}>Add Entry</Button>;    

        const addLoadingBtn =  <Button variant="primary" disabled>
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
            this.removeUser(this.state.editFieldID)
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
        
        const status = [
            'confirmed',
            'pending'
        ]

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
                            <Modal.Title>Delete Record?</Modal.Title>
                        </Modal.Header>
    
                        <Modal.Body>
                            <p>Are you sure you want to delete this record?</p>
                        </Modal.Body>
    
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.toggleDeleteModal}>Cancel</Button>
                            {
                               !this.state.deleteBtnClicked ?  deleteBtn : loadingDeleteBtn
                            }
                        </Modal.Footer>
                        </Modal.Dialog>
                         </div>  


                {/* export file modal */}
                <div className="modal-bg" style={{
                    display: this.state.exportFileModal
                }}>
                <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                    display: this.state.exportFileModal
                }}>
                    <Modal.Header >
                        <Modal.Title>Export to Excel file</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                        <b>Are you sure you want to export?</b>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleExportModalDisplay}>Cancel</Button>
                        {
                           this.state.exportbtnClicked < 1 ? exportBtn : exportLoadingBtn
                       }
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

                {/* send email modal */}
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
                        <Form.Group controlId="formRecipients">
                            <Form.Label>Recipients</Form.Label>

                           <div style={{display: 'flex'}}>
                           <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-secondary"
                                        title="Industry"
                                        id="input-group-dropdown-12"
                                        >
                                            {
                                                categories.map( category => {
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
                                        title={this.state.projectName}
                                        id="input-group-dropdown-104"
                                        >
                                            {
                                                this.state.projects.map(project => {
                                                    return(
                                                        <Dropdown.Item key={project._id} onClick={() => {
                                                            this.setState({
                                                                projectName: project.projectName,
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
                        <Button variant="primary" onClick={() => {this.setState({ emailBtnClicked: 1 })}}>{this.state.emailBtnClicked < 0 ? 'Sending...' : 'Send email'}</Button>
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

                            <Form.Group controlId="industry">
                                <Form.Label>Industry</Form.Label>
                                <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-secondary"
                                        title="Industry"
                                        id="input-group-dropdown-12"
                                        >
                                            {
                                                categories.map(industry => {
                                                    return(
                                                        <Dropdown.Item key={industry.industry} 
                                                          onClick={() => {
                                                              this.setState({
                                                                  chosenIndustry: industry.industry
                                                              })
                                                          }}
                                                        >{industry.industry}</Dropdown.Item>
                                          )
                                                })
                                            }

                                    </DropdownButton>
                                </Form.Group>                       

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

                {/* add a report modal */}
                <div className="modal-bg" style={{
                    display: this.state.addModalDisplay
                }}>
                <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                    display: this.state.addModalDisplay
                }}>
                    <Modal.Header >
                        <Modal.Title>Report Entry</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <Form id="add-form">

                    <Form.Group controlId="projects">
                            <Form.Label>Project</Form.Label>
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
                            <Form.Control name="company" type="textbox" placeholder="Enter name" />
                        </Form.Group>

                        <Form.Group controlId="formContactPerson">
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control type="textbox" placeholder="Contact Person"/>
                        </Form.Group>

                        <Form.Group controlId="formPosition">
                            <Form.Label>Position</Form.Label>
                            <Form.Control type="textbox" placeholder="Position"/>
                        </Form.Group>

                        <Form.Group controlId="email1">
                            <Form.Label>Email 1</Form.Label>
                            <Form.Control type="textbox" placeholder="example@example.com"/>
                        </Form.Group>

                        <Form.Group controlId="email2">
                            <Form.Label>Email 2</Form.Label>
                            <Form.Control type="textbox" placeholder="example@example.com"/>
                        </Form.Group>

                        <Form.Group controlId="mobile1">
                            <Form.Label>Mobile 1</Form.Label>
                            <Form.Control type="textbox" placeholder="07000000"/>
                        </Form.Group>

                         <Form.Group controlId="mobile2">
                            <Form.Label>Mobile 2</Form.Label>
                            <Form.Control type="textbox" placeholder="0700000"/>
                        </Form.Group>                       

                        <Form.Group controlId="website">
                            <Form.Label>Website</Form.Label>
                            <Form.Control type="textbox" placeholder="www.example.com"/>
                        </Form.Group>                       

                        <Form.Group controlId="industry">
                            <Form.Label>Industry</Form.Label>
                            <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-secondary"
                                        title={this.state.chosenIndustry}
                                        id="input-group-dropdown-2"
                                        >
                                            {
                                                categoriesAndIndustries.map(industry => {
                                                    return(
                                                        <Dropdown.Item key={industry.industry} 
                                                          onClick={() => {
                                                              this.setState({
                                                                  chosenIndustry: industry.industry
                                                              })
                                                          }}
                                                        >{industry.industry}</Dropdown.Item>
                                                    )
                                                })
                                            }

                                    </DropdownButton>
                        </Form.Group>                       

                        <Form.Group controlId="productDescription">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control name="productdescription" type="textbox" placeholder="e.g spare parts"/>
                        </Form.Group>                       

                        <Form.Group controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Control name="country" type="textbox" placeholder="e.g Kenya"/>
                        </Form.Group>                       


                        </Form>
                    </Modal.Body>
                    <small id="warning" style={{color: 'red', margin: '18px'}}></small>
                    <br/>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.toggleAddModalDisplay}>Close</Button>
                        {
                            this.state.addBtnClicked < 1 ? addBtn : addLoadingBtn
                        }
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
                        <Button variant="primary" onClick={ () => {this.addComment(this.state.editFieldID)}}>Add comment</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>

                
                {/* add a industry modal */}
                <div className="modal-bg" style={{
                    display: this.state.categoryModal
                }}>
                <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                    display: this.state.categoryModal
                }}>
                    <Modal.Header >
                        <Modal.Title>Add An Industry/Subsector</Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                    <Form>
                            <Form.Group controlId="formRecipients">
                                <Form.Label></Form.Label>
                                </Form.Group>
                            
                                <Form.Group controlId="formIndustryName">
                                    <Form.Label>Industry</Form.Label>
                                    <Form.Control className="industrysubsector" type="textbox" placeholder="e.g BANKING"/>
                                </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={ () => {
                            this.toggleIndstryModalDisplay();
                            }}>Cancel</Button>
                        <Button variant="primary" onClick={() => {
                            this.setState({
                                industryBtnClicked: true
                            });
                            axios.post(_CONFIG.API_URI+"/api/v1/admin/add_industry", {
                                industry: document.getElementsByClassName("industrysubsector")[0].value
                            }, {
                                headers: {
                                    'auth-token': `${localStorage.getItem('auth-token')}`
                                  }
                            }).then(res => {
                                alert("Succesfully added an Industry" + res);
                                this.reloadPage();
                            }).catch(err => {console.log(err)})
                        }}>{this.state.industryBtnClicked ? 'Adding...' : 'Add'}</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>

   


                <div className="container">
                    <h2 id="h2-title">Database  <span style={{fontSize: '18px'}}>(Total: {this.state.reports.length} records)</span></h2>
                    <Nav variant="pills" defaultActiveKey="#" className="navigation-tab-menu" style={{position: 'absolute', left:' 50px'}}>
                        <Nav.Item>
                            <Nav.Link href="#" onClick={() => {this.resetToDefault()}}>View</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link onClick={this.toggleExportModalDisplay} eventKey="link-1">
                                    Export
                                    <img src={excel} alt="add" style={{width: '1.5rem', height: '1.5rem', borderRadius: '50%',marginLeft: '5px'}}/>
                            </Nav.Link>
                        </Nav.Item>
                
                        <Nav.Item>
                            <Nav.Link style={{position: 'absolute', right: 0,top: 0, display: 'flex'}}>
                                <span style={{ marginRight: '1rem' }}>Filter:</span>

                                        {/* filter according to Confirmed*/}
                                        <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-primary"
                                        title={this.state.status}
                                        id="input-group-dropdown-4"
                                        >
                                                    {
                                                        status.map(stat => {
                                                            return (
                                                                <Dropdown.Item onClick={() => {
                                                                    if(stat === 'confirmed'){
                                                                        this.setState({
                                                                            reports: this.state.reports.filter(report => report.confirmed)
                                                                        });
                                                                        return 0;
                                                                    }
                                                                    this.setState({
                                                                        reports: this.state.reports.filter(report => !report.confirmed)
                                                                    });
                                                                }}>{stat}
                                                             </Dropdown.Item>
                                                            )
                                                        })
                                                    }   
                                    </DropdownButton>
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
                                                        onClick={() => {
                                                            this.setState({
                                                                chosenIndustry: category.industry
                                                            })
                                                        }}
                                                        id="input-group-dropdown-3"
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
                                        title="Project"
                                        id="input-group-dropdown-4"
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
                                    {/* filter according to user*/}
                                    <DropdownButton
                                        style={{ marginRight: '1rem' }}
                                        variant="outline-primary"
                                        title={this.state.chosenUser}
                                        id="input-group-dropdown-5"
                                        >
                                            {
                                                this.state.users.map( user => {
                                                    return(
                                                        <Dropdown.Item key={user._id} onClick={() => {
                                                            this.setState({
                                                                chosenUser: user.fullname,
                                                                reports: this.state.reports.filter( report => report.submittedBy.toLowerCase() === user.username.toLowerCase())
                                                            })
                                                        }}>{user.fullname}</Dropdown.Item>
                                                    )
                                                })
                                            }
                                    </DropdownButton>
                            </Nav.Link>
                        </Nav.Item>
                    <Nav.Item onClick={this.toggleEmailModalDisplay}>
                            <Nav.Link eventKey="link-4">
                                Send bulk email
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item style={{position: 'absolute', left: '30%'}}>
                        <Nav.Link href="#action"  onClick={
                            () => {
                                this.toggleImportModalDisplay()
                            }}>
                            Import file
                            <img src={excel} alt="add" style={{width: '1.5rem', height: '1.5rem', borderRadius: '50%',marginLeft: '5px'}}/>
                        </Nav.Link>
                        
                        </Nav.Item>

                        <Nav.Item style={{position: 'absolute', left: '42.5%'}}>
                            <Nav.Link href="#"  onClick={
                                () => {
                                    this.toggleAddModalDisplay();
                                }}>
                                Add entry
                           </Nav.Link>                        
                        </Nav.Item>
                      
                        <Nav.Item style={{position: 'absolute', left: '52.5%'}}>
                        <Nav.Link href="#" onClick={ () => {
                            this.toggleIndstryModalDisplay();
                        }}>
                            Add Industry
                       </Nav.Link>                        
                    </Nav.Item>
                        </Nav>
                    <section className="section-container" > 
                    <Table variant='dark' className="reports-table table-responsive" style={{marginTop: '30px', overflowY: 'scroll'}} striped bordered hover responsive >
                            <thead>
                                <tr variant="light">
                                <th>#</th>
                                <th>Industry</th>
                                <th>Organization</th>
                                <th>Website</th>
                                <th>Contacts</th>
                                <th>Contact person</th>
                                <th>Telephone</th>
                                <th>Designation</th>
                                <th>Email address</th>
                                <th>Physical location</th>
                                <th>Project</th>
                                <th>Status</th>
                                <th>Collection Time</th>
                                <th>Submitted by</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.reports.map((user,index) => {
                                    return(<>
                                    <div
                                        key={user.organization} 
                                        className="delete-icon" 
                                        style={{ 
                                                 position: 'absolute',
                                                 left: '-105px',
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
                                    
                                    <img  key={user.password} src={edit} style={{marginLeft: '-5px',}} className="delete-icon" 
                                        onClick={() => {
                                            window.scrollTo(0, 0);
                                            this.setState({
                                                editFieldID: user._id,
                                                editFieldIndex: index
                                            });
                                            this.toggleEditModalDisplay()
                                            }}/> 
                                    <img  key={user.password} src={trash} style={{marginLeft: '30px'}} className="delete-icon" onClick={() => {
                                        window.scrollTo(0, 0);
                                        this.setState({
                                            editFieldID: user._id
                                           
                                        });
                                        this.toggleDeleteModal();
                                    }}/>
                                        <tr key={index} className="user-rows" onClick={this.toggleIndividualEmailModalDisplay}>
                                        <td>{index+1}</td>
                                        <td> {user.industry }</td>
                                        <td>{user.organization }</td>
                                        <td> {user.website}</td>
                                        <td>{user.contacts}</td>
                                        <td>{user.contactPerson}</td>
                                        <td>{user.telephone}</td>
                                        <td>{user.designation}</td>
                                        <td>{user.emailAddress}</td>
                                        <td>{ user.physicalLocation }</td>
                                        <td>{ user.projectName }</td>
                                        <td style={{ color: 'yellow'}}>{ user.status ? 'Confirmed' : 'Pending'}</td>
                                        <td>{user.collectionTime}</td>
                                        <td>{ user.submittedBy}</td>
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