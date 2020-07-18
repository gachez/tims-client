import React from 'react';
import '../shared/ReportsView.css';
import {Spinner,Table, Nav, Dropdown, DropdownButton,Modal, Form, Button} from 'react-bootstrap';
import trash from './shared/trash.png';
import edit from '../shared/edit.png';
import tick from '../shared/tick.png';
import excel from '../shared/excelicon.png';
import axios from 'axios';
import 'react-dropzone-uploader/dist/styles.css';
import {categories} from '../shared/lib/categories';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';
import { addCategory } from '../shared/lib/categories';



export default class ReportsView extends React.Component{

    state = {
        editSave: 'none',
        users: [],
        isLoaded: false,
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
        addBtnClicked: 0,
        deleteBtnClicked: false,
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
        axios.get("https://tims-client.df.r.appspot.com/api/v1/admin/get_reports", {
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

          axios.get('https://tims-client.df.r.appspot.com/api/v1/admin/get_industries',{
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {
              this.setState({
                  industries: res.data
              })
          })

          axios.get('https://tims-client.df.r.appspot.com/api/v1/admin/get_users', {
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

        axios.get('https://tims-client.df.r.appspot.com/api/v1/admin/get_projects', {
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


    getEditField = (id ) => {
        const field = this.state.reports.filter(report => report._id === id);

        return field;

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
            industry: edits[8].value.length < 1 ? edits[8].getAttribute('placeholder') : edits[8].value,
            productDescription: edits[9].value.length < 1 ? edits[9].getAttribute('placeholder') : edits[9].value,
            country: edits[10].value.length < 1 ? edits[10].getAttribute('placeholder') : edits[10].value,
            collectionDate: new Date(),
            collectionTime: new Date(),
            submittedBy: 'admin'
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

    getAddEntryFormValues = async () => {
        const edits = await Array.from(document.getElementById('add-form')).map(node => node);

        const savedReport = {
            projectName: this.state.projectName,
            companyName:  edits[1].value, 
            contactPerson: edits[2].value,
            position:   edits[3].value,
            email1:    edits[4].value,
            email2:   edits[5].value,
            mobile1:   edits[6].value,
            mobile2:   edits[7].value,
            website: edits[8].value,
            industry: this.state.determinedIndustry,
            subSector: this.state.chosenIndustry,
            productDescription: document.getElementsByName("productdescription")[0].value,
            country: document.getElementsByName("country")[0].value,
            collectionDate: new Date().toUTCString(),
            collectionTime: new Date().toUTCString(),
            submittedBy: 'admin'
        }

        return savedReport;
    }

    addReport = async (savedReport) => {
  
        const toSave = await savedReport;
        try{
            axios.post("https://a123ef.df.r.appspot.com/api/v1/admin/add_record", toSave, {
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
            axios.delete("https://a123ef.df.r.appspot.com/api/v1/admin/delete_record/" + id,  {
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
        console.log('function called');
        this.setState({
            exportbtnClicked: 1
        })
        axios.post('https://tims-client.df.r.appspot.com/api/v1/export_excel', this.state.reports,//your url
           {  
               headers: {
                        'auth-token': `${localStorage.getItem('auth-token')}`
                    },
            responseType: 'blob', // important
          }).then((response) => {
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', 'reports.xlsx'); //or any other extension
             document.body.appendChild(link);
             link.click();
             this.setState({
                 exportbtnClicked: 0
             })
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
                data: data, 
                cols: make_cols(ws['!ref'])
             },
              () => {
                  this.state.data.forEach( (imports,index) => {
                     let dataObj = {    
                        projectName: imports['Project Name'],
                        companyName:  imports['Company Name'], 
                        contactPerson: imports['Contact Person'],
                        position:   imports['Position'],
                        email1:    imports['Email 1'],
                        email2:   imports['Email 2'],
                        mobile1:   imports['Mobile 1'].toString(),
                        mobile2:   imports['Mobile 2'],
                        website: imports['Website'],
                        industry: imports['Industry'],
                        subSector: typeof imports['Subsector'] === "undefined" ? 'none' : imports['Subsector'],
                        productDescription: imports['Product Description'],
                        country: imports['Country'],
                        confirmed: imports['Confirmed'] < 1 ? false : true,
                        collectionDate: new Date().toUTCString(),
                        collectionTime: new Date().toUTCString(),
                        submittedBy: 'admin'
                    };  

                    axios.post("https://a123ef.df.r.appspot.com/api/v1/admin/add_record", dataObj, {
                        'Content-Type': 'application/json;charset=UTF-8',
                        headers: {
                            'auth-token': `${localStorage.getItem('auth-token')}`
                        }
                    }).then(res => {
                        console.log('Succesfully added file record ' + res)
                    }).catch(err => {
                        console.log(err)
                    });
                });
                alert('Succesfully imported file data');
               
            });
        };
     
        if (rABS) {
          reader.readAsBinaryString(this.state.file);
        } else {
          reader.readAsArrayBuffer(this.state.file);
        };
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
        console.log(this.state.reports)

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

                                                        <div style={{maxHeight: '350px', overflowY: 'scroll'}}>
                                                            {
                                                                category.subSector.map( subsector => {
                                                                    return(
                                                                      <Dropdown.Item key={subsector} >{subsector}</Dropdown.Item>
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
                        <Button variant="primary">Send Email</Button>
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
                                                categoriesAndIndustries.map( category => {
                                                    return(
                                                        <>
                                                        <DropdownButton
                                                        key={category.industry}
                                                        style={{width: '70%', margin: '15px'}}
                                                        variant="outline-secondary"
                                                        title={category.industry}
                                                        id="input-group-dropdown-14"
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
                                        title={this.state.industry}
                                        id="input-group-dropdown-2"
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
                                                        onClick={() => {this.setState({ determinedIndustry: category.industry})}}
                                                        id="input-group-dropdown-31"
                                                        >

                                                        <div 
                                                            style={{maxHeight: '350px', overflowY: 'scroll'}} 
                                                          >
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
                        </Form.Group>                       

                        <Form.Group controlId="productDescription">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control name="productdescription" type="textbox" placeholder="e.g supplies"/>
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


                {/* add a category modal */}
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
                                    <Form.Control className="industrysubsector" type="textbox" placeholder="e.g BUILDING AND CONSTRUCTION"/>
                                </Form.Group>

                                <Form.Group controlId="formSubsectorName">
                                    <Form.Label>Subsector</Form.Label>
                                    <Form.Control className="industrysubsector" type="textbox" placeholder="e.g Automation"/>
                                    <small style={{color: 'green'}}>Kindly separate subsectors with a comma ","</small>
                                </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={ () => {
                            this.toggleIndstryModalDisplay();
                            }}>Cancel</Button>
                        <Button variant="primary" onClick={() => {
                            axios.post("https://tims-client.df.r.appspot.com/api/v1/admin/add_industry", {
                                industry: document.getElementsByClassName("industrysubsector")[0].value,
                                subSector: document.getElementsByClassName("industrysubsector")[1].value
                            }, {
                                headers: {
                                    'auth-token': `${localStorage.getItem('auth-token')}`
                                  }
                            }).then(res => {
                                alert("Succesfully added an Industry" + res);
                                this.reloadPage();
                            }).catch(err => {console.log(err)})
                        }}>Add</Button>
                    </Modal.Footer>
                    </Modal.Dialog>
                </div>

   


                <div className="container">
                    <h2 id="h2-title">Database</h2>
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
                                                        <DropdownButton
                                                        key={category.industry}
                                                        style={{width: '70%', margin: '15px' }}
                                                        variant="outline-secondary"
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
                                                                                    reports: this.state.reports.filter(report => report.subSector === subsector)
                                                                                });
                                                                          
                                                                        }}
                                                                      >{subsector}</Dropdown.Item>
                                                        )
                                                                }) :   category.subSector.split(",").map( subsector => {
                                                                    return(
                                                                      <Dropdown.Item key={subsector} 
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                chosenIndustry: subsector,
                                                                                reports: this.state.reports.filter(report => report.subSector === subsector)
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
                    <Table variant='dark' className="reports-table" style={{marginTop: '30px', overflowY: 'scroll'}} striped bordered hover responsive >
                            <thead>
                                <tr variant="light">
                                <th>#</th>
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
                                <th>Project</th>
                                <th>Confirmed</th>
                                <th>Collection Date</th>
                                <th>Collection Time</th>
                                <th>Submitted by</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.reports.reverse().map((user,index) => {
                                    return(<>
                                
                                    <img  key={user.password} src={edit} style={{marginLeft: '-5px',}} className="delete-icon" 
                                        onClick={() => {
                                            this.setState({
                                                editFieldID: user._id,
                                                editFieldIndex: index
                                            });
                                            this.toggleEditModalDisplay()
                                            }}/> 
                                    <img  key={user.password} src={trash} style={{marginLeft: '30px'}} className="delete-icon" onClick={() => {
                                        this.setState({
                                            editFieldID: user._id
                                           
                                        });
                                        this.toggleDeleteModal();
                                    }}/>
                                        <tr key={index} className="user-rows" onClick={this.toggleIndividualEmailModalDisplay}>
                                        <td>{index}</td>
                                        <td> {user.companyName }</td>
                                        <td>{user.contactPerson }</td>
                                        <td> {user.position}</td>
                                        <td>{user.email1}</td>
                                        <td>{user.email2}</td>
                                        <td>{user.mobile1}</td>
                                        <td>{user.mobile2}</td>
                                        <td>{user.website}</td>
                                        <td>{ user.industry }</td>
                                        <td>{ user.subSector }</td>
                                        <td>{ user.productDescription }</td>
                                        <td>{ user.country }</td>
                                        <td>{ user.projectName }</td>
                                        <td style={{ color: 'yellow'}}>{ user.confirmed ? 'Confirmed' : 'Pending'}</td>
                                        <td>{ user.collectionDate }</td>
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