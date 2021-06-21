import React from 'react';
import {Modal, Form, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import importFile from '../shared/lib/services/importFile';


export default function AddTender(props){
    return(             
                <div className="modal-bg" style={{
                            display: props.showAddModal
                        }}>
                            <Modal.Dialog scrollable={true} 
                            style={{
                              display: props.showAddModal
                            }} className="modal-add-entry" >
                                <Modal.Header >
                                  <Modal.Title>Add Tender</Modal.Title>
                                </Modal.Header>
        
                                <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                                <Form id="edit-form">
                                    <Form.Group controlId="formAddName">
                                        <Form.Label>Tender name</Form.Label>
                                        <Form.Control id="tenderName" type="textbox" placeholder="Tender name" />
                                    </Form.Group>
        
                                    <Form.Group controlId="formAddNo">
                                        <Form.Label>Tender No:</Form.Label>
                                        <Form.Control id="tenderNo" type="textbox" placeholder="Tender Number" />
                                    </Form.Group>
        
                                    <Form.Group controlId="formClosingDate">
                                        <Form.Label>Closing date</Form.Label>
                                        <Form.Control id="closing date" type="date" placeholder="Closing date" />
                                    </Form.Group>
        
                                    <Form.Group controlId="formAddOrganisation">
                                        <Form.Label>Organisation</Form.Label>
                                        <Form.Control id="tenderOrganisation" type="textbox" placeholder="Organisation" />
                                    </Form.Group>

                                    <Form.Group controlId="formSubmission">
                                        <Form.Label>Submission method</Form.Label>
                                        <Form.Control id="submission" as="textarea" rows={2} placeholder="Submission method" />
                                    </Form.Group>

                                    <Form.Group controlId="formAddChecklist">
                                        <Form.Label>Import checklist</Form.Label>
                                        <Form.Control type="file" placeholder="checklist upload" onChange={(e) => importFile(e.target)} />
                                    </Form.Group>

                                    <Form.Group controlId="formMandatory">
                                        <Form.Label>Mandatory requirements <small style={{color: 'red'}}>*or import checklist</small></Form.Label>
                                        <Form.Control as="textarea" rows={5} placeholder="Mandatory requirements" id="mandatory" />
                                    </Form.Group>

                                    <Form.Group controlId="formEvaluation">
                                        <Form.Label>Evaluation criteria <small style={{color: 'red'}}>*or import checklist</small></Form.Label>
                                        <Form.Control id="evaluation" as="textarea" rows={5} placeholder="Evaluation criteria" />
                                    </Form.Group>

                                    <Form.Group controlId="formStatus">
                                        <Form.Label>Status</Form.Label>
                                        <DropdownButton 
                                            title="Status"
                                        >
                                            <Dropdown.Item style={{backgroundColor: 'transparent'}}>Open</Dropdown.Item>
                                            <Dropdown.Item style={{backgroundColor: '#28a745'}}>Participating</Dropdown.Item>
                                            <Dropdown.Item style={{backgroundColor: 'red'}}>Closed</Dropdown.Item>
                                        </DropdownButton>
                                    </Form.Group>                   
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={props.handleAddModal}>Cancel</Button>
                                    <Button variant="primary" >Save</Button>
                                </Modal.Footer>
                                </Modal.Dialog>
                        </div>   
    )
}