import React from 'react'
import {Button,Spinner, Modal} from 'react-bootstrap'

export default function DeleteModal(props){
    const [deleteBtnClicked, setClicked] = React.useState(false)

    const deleteBtn = <Button variant="primary" onClick={() => {
        setClicked(true)
        props.removeUser(props.editFieldID)
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

    return(
        <div className="modal-bg" style={{
            display: props.deleteModalDisplay
                }}>
             
            <Modal.Dialog  className="modal-add-user" style={{
            display: props.deleteModalDisplay
                }}>
            <Modal.Header >
                <Modal.Title>Delete Record?</Modal.Title>
            </Modal.Header>
    
            <Modal.Body>
                <p>Are you sure you want to delete this record?</p>
            </Modal.Body>
    
            <Modal.Footer>
                <Button variant="secondary" onClick={props.toggleDeleteModal}>Cancel</Button>
                {
                   !deleteBtnClicked ?  deleteBtn : loadingDeleteBtn
                }
            </Modal.Footer>
            </Modal.Dialog>
             </div>  
    
    )
    }