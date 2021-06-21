import React from 'react'
import {Modal, Button} from 'react-bootstrap'

export default function ImportFileModal(props){
    return(
                        <div className="modal-bg" style={{
                            display: props.importFileModal
                        }}>
                        <Modal.Dialog scrollable={true}  className="modal-add-entry" style={{
                            display: props.importFileModal
                        }}>
                            <Modal.Header >
                                <Modal.Title>Choose file to import</Modal.Title>
                            </Modal.Header>
        
                            <Modal.Body style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                            <label for="avatar">Choose a file:</label>
        
                                <input type="file"
                                    id="avatar" name="avatar"
                                    accept={!props.SheetJSFT ? '' : props.SheetJSFT}
                                    onChange={props.handleChange} 
                                    />
                                    <br />
                                <small style={{color: 'red'}}>
                                 File should be of .xlsx type.
                                </small>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={props.toggleImportModalDisplay}>Cancel</Button>
                               {
                                   props.importBtnClicked < 1 ? props.importBtn : props.importLoadingBtn
                               }
                            </Modal.Footer>
                            </Modal.Dialog>
                        </div>
    )
}