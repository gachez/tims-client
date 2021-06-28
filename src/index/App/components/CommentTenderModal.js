import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'

export default function CommentTenderModal(props){
    return(
                        <div className="modal-bg" style={{
                            display: props.commentModal
                        }}>
                        <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                            display: props.commentModal
                        }}>
                            <Modal.Header >
                                <Modal.Title>Comments</Modal.Title>
                            </Modal.Header>
                            <ul style={{marginTop: '1.25rem'}}>
                            {
                                props.data.filter( report => report._id === props.editFieldID ).map(report => {
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
                                <Button variant="secondary" onClick={props.toggleCommentModalDisplay}>Cancel</Button>
                                <Button variant="primary" onClick={ () => {props.addComment(props.editFieldID)}}>Add comment</Button>
                            </Modal.Footer>
                            </Modal.Dialog>
                        </div>
    )
}