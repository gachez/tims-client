import React from 'react';
import {Modal, Form, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import _CONFIG from '../../../config/config';


export default function EditTender(props){

    const editTender = (tender, id) => {
        fetch(_CONFIG.API_URI+"/api/v1/update_tender/"+id, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${localStorage.getItem('auth-token')}`
            },
            body: JSON.stringify(tender),
            })
            .then(response => response.json())
            .then(dat => {
            console.log('Success edited tender:', dat);
            alert('Changes saved.')
            window.location.reload()
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    } 
    

    const [tenderName, setName] = React.useState('')
    const [tenderNo, setTenderNo] = React.useState('')
    const [organisation, setOrg] = React.useState('')
    const [submissionMethod, setSubmissionMethod] = React.useState('')
    const [closingDate, setClosing] = React.useState('')
    const [mandatoryRequirements, setMandatory] = React.useState('')
    const [evaluationCriteria, setCriteria] = React.useState('')
    const [status, setStatus] = React.useState("Status")
    const [eligibility, setEligibility] = React.useState('')
    const [uploadedBy, setUploaded] = React.useState(props.currentUser)
    const [dateSeen, setDateSeen] = React.useState(new Date().toISOString().slice(0,10).split("-").reverse().join("-"))
    return(             
                <div className="modal-bg" style={{
                            display: props.showEditModal
                        }}>
                            <Modal.Dialog scrollable={true} 
                            style={{
                              display: props.showEditModal
                            }} className="modal-add-entry" >
                                <Modal.Header >
                                  <Modal.Title>Edit Tender</Modal.Title>
                                </Modal.Header>
        
                                <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                                <Form id="edit-form">
                                    <Form.Group controlId="formAddName">
                                        <Form.Label>Tender name</Form.Label>
                                        <Form.Control id="tenderName" type="textbox" placeholder={!props.tenders[0] ? '...' : props.tenders[0].tenderName} onChange={e => setName(e.target.value)} />
                                    </Form.Group>
        
                                    <Form.Group controlId="formAddNo">
                                        <Form.Label>Tender No:</Form.Label>
                                        <Form.Control id="tenderNo" type="textbox" placeholder={!props.tenders[0] ? '...' : props.tenders[0].tenderNo} onChange={e => setTenderNo(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group controlId="formEligibility">
                                        <Form.Label>Eligibility</Form.Label>
                                        <Form.Control id="eligibility" type="textbox" placeholder={!props.tenders[0] ? '...' : props.tenders[0].eligibility} onChange={e => setEligibility(e.target.value)} />
                                    </Form.Group>
        
                                    <Form.Group controlId="formClosingDate">
                                        <Form.Label>Closing date</Form.Label>
                                        <Form.Control id="closing date" type="date" defaultValue={!props.tenders[0] ? '...' : props.tenders[0].closingDate} onChange={e => setClosing(e.target.value)} />
                                    </Form.Group>
        
                                    <Form.Group controlId="formAddOrganisation">
                                        <Form.Label>Organisation</Form.Label>
                                        <Form.Control id="tenderOrganisation" type="textbox" placeholder={!props.tenders[0] ? '...' : props.tenders[0].organisation} onChange={e => setOrg(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group controlId="formSubmission">
                                        <Form.Label>Submission method</Form.Label>
                                        <Form.Control id="submission" as="textarea" rows={2} placeholder={!props.tenders[0] ? '...' : props.tenders[0].submissionMethod} onChange={e => setSubmissionMethod(e.target.value)} />
                                    </Form.Group>

                                    {/* <Form.Group controlId="formAddChecklist">
                                        <Form.Label>Import checklist</Form.Label>
                                        <Form.Control type="file" placeholder="checklist upload" onChange={(e) => importFile(e.target)} />
                                    </Form.Group> */}

                                    <Form.Group controlId="formMandatory">
                                        <Form.Label>Mandatory requirements </Form.Label>
                                        <Form.Control as="textarea" rows={5} placeholder={!props.tenders[0] ? '...' : props.tenders[0].mandatoryRequirements} id="mandatory"  onChange={e => setMandatory(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group controlId="formEvaluation">
                                        <Form.Label>Evaluation criteria </Form.Label>
                                        <Form.Control id="evaluation" as="textarea" rows={5} placeholder={!props.tenders[0] ? '...' : props.tenders[0].evaluationCriteria} onChange={e => setCriteria(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group controlId="formStatus">
                                        <Form.Label>Status</Form.Label>
                                        <DropdownButton 
                                            title={status }         
                                        >
                                            <Dropdown.Item style={{backgroundColor: 'transparent'}} onClick={() => setStatus('Open')}>Open</Dropdown.Item>
                                            <Dropdown.Item style={{backgroundColor: '#28a745'}} onClick={() => setStatus('Participating')}>Participating</Dropdown.Item>
                                            <Dropdown.Item style={{backgroundColor: 'red'}} onClick={() => setStatus('Closed')} >Closed</Dropdown.Item>
                                        </DropdownButton>
                                    </Form.Group>                   
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={props.handleEditModal}>Cancel</Button>
                                    <Button variant="primary" onClick={() => {
                                        editTender({
                                            tenderName: tenderName === '' ? props.tenders[0].tenderName : tenderName,
                                            tenderNo: tenderNo === '' ? props.tenders[0].tenderNo : tenderNo,
                                            organisation: organisation === '' ? props.tenders[0].organisation : organisation,
                                            closingDate: closingDate === '' ? props.tenders[0].closingDate : closingDate,
                                            submissionMethod: submissionMethod === '' ? props.tenders[0].submissionMethod : submissionMethod,
                                            mandatoryRequirements: mandatoryRequirements === '' ? props.tenders[0].mandatoryRequirements : mandatoryRequirements,
                                            evaluationCriteria: evaluationCriteria === '' ? props.tenders[0].evaluationCriteria : evaluationCriteria,
                                            status: status === 'Status' ? props.tenders[0].status : status
                                        }, props.id)
                                    }} >Save</Button>
                                </Modal.Footer>
                                </Modal.Dialog>
                        </div>   
    )
}