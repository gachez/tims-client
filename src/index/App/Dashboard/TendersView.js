import React from 'react';
import {Nav, Table, Button, Spinner} from 'react-bootstrap';
import _CONFIG from '../../../config/config';
import TenderModal from '../components/TenderModal';
import AddTender from '../components/AddTender';
import excel from '../shared/excelicon.png';
import ImportFileModal from '../components/ImportFileModal';
import importFileTender from '../shared/lib/services/importFile';
import DeleteModal from '../components/DeleteModal';
import axios from 'axios';
import EditTender from '../components/EditTender';
import { chooseColor } from '../shared/lib/util';

export default function TendersView(props){
    React.useEffect(() => {
        fetch(_CONFIG.API_URI+'/tenders', {
            headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token')
          }})
        .then(response => response.json())
        .then(data => {
            setLoaded(true)
            setTenders(data)})
        .catch(err => console.log(err))

    }, [])

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
        importFileTender(file, props.loggedInUSer[0])
        setClicked(1)
        }}>Import</Button>;


    const toggleDeleteModal = () => {
      showDel === 'none' ? setShowDel('block') : setShowDel('none')
    }    
    const deleteTender = async (ID) => {
        try{
            axios.delete(_CONFIG.API_URI+"/api/v1/delete_tender/" + ID,  {
                headers: {
                'auth-token': `${localStorage.getItem('auth-token')}`
                }
            })
            .then(res => {
                console.log('succesfully deleted record ' + res)
                alert('Succesfully deleted record');
                toggleDeleteModal();
                window.location.reload()
            })
        } catch (err) {console.log('sorry ' + err)}
    }
    const handleClose = () => {
        show === 'none' ? setShow('block') : setShow('none')
    }

    const handleAddModal = () => {
        showAdd === 'none' ? setShowAdd('block') : setShowAdd('none')
    }

    const toggleImportModalDisplay = () => {
        importFileModal === 'none' ? setImportFile('block') : setImportFile('none')
    }

    const handleModal = ({
        tenderName,
        tenderNo,
        organisation,
        closingDate,
        eligibility,
        submission,
        mandatory,
        evaluation,
        status,
        uploadedBy,
        id
    }) => {
        setDateClosing(closingDate)
        setEligibility(eligibility)
        setEvaluation(evaluation)
        setMandatory(mandatory)
        setOrganisation(organisation)
        setStatus(status)
        setTenderName(tenderName)
        setTenderNo(tenderNo)
        setSubmission(submission)
        setUploadedBy(uploadedBy)
        setID(id)
    }

    const handleChange = (e) => {
        setFile(e.target);
      };
    
    const handleEditModal = () => {
        showEditModal === 'none' ? setEditModal('block') : setEditModal('none')
    }

    const [showEditModal, setEditModal] = React.useState('none')
    const [tenders, setTenders] = React.useState([])
    const [show, setShow] = React.useState('none')
    const [showAdd, setShowAdd] = React.useState('none')
    const [tenderName, setTenderName] = React.useState()
    const [organisation, setOrganisation] = React.useState()
    const [tenderNo, setTenderNo] = React.useState()
    const [dateClosing, setDateClosing] = React.useState()
    const [eligibility, setEligibility] = React.useState()
    const [submission, setSubmission] = React.useState()
    const [mandatory, setMandatory] = React.useState()
    const [evaluation, setEvaluation] = React.useState()
    const [status, setStatus] = React.useState()
    const [uploadedBy, setUploadedBy] = React.useState(props.loggedInUSer[0])
    const [importFileModal, setImportFile] = React.useState('none')
    const [file, setFile] = React.useState()
    const [importBtnClicked, setClicked] = React.useState(0)
    const [isLoaded, setLoaded] = React.useState(false)
    const [id, setID] = React.useState()
    const [showDel,setShowDel] = React.useState('none')

    return isLoaded ? (
        <div className="container">
            <TenderModal
             handleClose={handleClose} 
             show={show}
             tenderName={tenderName}
             tenderNo={tenderNo}
             closingDate={dateClosing}
             organisation={organisation}
             status={status}
             eligibility={eligibility}
             submissionMethod={submission}
             mandatoryRequirements={mandatory}
             evaluationCriteria={evaluation}
             uploadedBy={uploadedBy}
             id={id}
             toggleDeleteModal={toggleDeleteModal}
             handleEditModal={handleEditModal}
             />
            <DeleteModal
                removeUser={deleteTender}
                deleteModalDisplay={showDel}
                toggleDeleteModal={toggleDeleteModal}
                editFieldID={id}
            />
             <ImportFileModal
              importFileModal={importFileModal}
              handleChange={handleChange}
              toggleImportModalDisplay={toggleImportModalDisplay}
              importBtnClicked={importBtnClicked}
              importBtn={importBtn}
              importLoadingBtn={importLoadingBtn}
             />
             <AddTender
              showAddModal={showAdd} 
              handleAddModal={handleAddModal} 
              currentUser={props.loggedInUSer[0]}
              />
            <EditTender
                showEditModal={showEditModal}
                handleEditModal={handleEditModal}
                id={id}
                tenders={tenders.filter(tender => tender._id === id)}
            />
            <h2 id="h2-title">Tenders Management</h2>
            <Nav variant="pills" defaultActiveKey="#" style={{marginTop: '2.5rem'}}>
                <Nav.Item>
                    <Nav.Link href="#">Tenders List</Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={handleAddModal}>
                    <Nav.Link eventKey="link-1">Add tender</Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={toggleImportModalDisplay} >
                    <Nav.Link eventKey="link-2">
                        <img width="28px" height="28px" src={excel} style={{borderRadius: '50%'}} /> Import file</Nav.Link>
                </Nav.Item>
            </Nav>
            <Table style={{marginTop: '2rem'}} bordered striped responsive hover >
            <thead>
                                <tr>
                                <th>#</th>
                                <th>Date uploaded</th>
                                <th>Organisation</th>
                                <th>Tender Name</th>
                                <th>Eligibility</th>
                                <th>Closing date</th>
                                <th>Status</th>
                                <th>Uploaded By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tenders.reverse().map((tender, index) => {
                                        return(
                                            <tr style={{cursor: 'pointer'}} onClick={() => {
                                                window.scrollTo(0,0)
                                                handleClose()
                                                handleModal({
                                                    tenderName: tender.tenderName,
                                                    tenderNo:tender.tenderNo,
                                                    organisation:tender.organisation,
                                                    closingDate: tender.closingDate,
                                                    eligibility: tender.eligibility,
                                                    submission: tender.submissionMethod,
                                                    mandatory: tender.mandatoryRequirements,
                                                    evaluation: tender.evaluationCriteria,
                                                    status: tender.status,
                                                    uploadedBy: tender.uploadedBy,
                                                    id: tender._id
                                                })
                                            }}
                                             >
                                                <td>{index+1}</td>
                                                <td>{tender.dateSeen}</td>
                                                <td>{tender.organisation}</td>
                                                <td>{tender.tenderName}</td>
                                                <td>{tender.eligibility}</td>
                                                <td>{tender.closingDate}</td>
                                                <td style={{color: chooseColor(tender.status), fontWeight: 'bolder' }} >{tender.status}</td>
                                                <td>{tender.uploadedBy}</td>
                                            </tr>
                                        )
                                    })                          
                                }
                            </tbody>
            </Table>
        </div>
    )
    :
    <div className="spinner-bg">
    <Spinner id="spinner" animation="grow" />
</div>
}