import React from 'react';
import {Modal} from 'react-bootstrap';
import trash from '../Dashboard/shared/trash.png';
import edit from '../shared/edit.png';
import comment from '../shared/chatbox.png';

const detailCard = {
    display: 'grid',
    gridGap: '.5rem',
    padding: '1rem 3rem',
    border: 'solid 1px rgba(0,0,0,0.1)',
    margin: '.25rem'
  }
  
  const detailTitle = {
    fontSize: '1.25rem',
    fontWeight: 'bolder',
    paddingTop: '1rem',
    textDecoration: 'underline'
  }
  
  const detailText = {
    fontSize: '1rem',
    color: '#000',
    fontWeight: 'normal'
  }
  

export default function TenderModal(props){
    return(
        <div style={{
            position: 'fixed',
            width: '100%',
            left: 0,
            top: 0,
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 99,
            display: props.show,
            paddingTop: '2rem' 
        }}>
          <div style={{backgroundColor: 'white', margin: 'auto', width: '60%', height: 'auto',maxHeight: '100vh',overflow: 'scroll', borderRadius: 8}}>
            <Modal.Header closeButton onClick={() => props.handleClose()}>
                <Modal.Title 
                style={{
                  fontSize: '1.35rem', 
                  fontWeight: 'bolder',
                  textAlign: 'left',
                  width: '70%', 
                  padding: '1rem'}} >
                    <span style={detailText}><b style={detailTitle}>Tender Name:</b><br /> {props.tenderName}</span><br /><br />
                    <span style={detailText}><b style={detailTitle}>Tender No:</b><br /> {props.tenderNo}</span><br />
                    <span style={detailText}><b style={detailTitle}>Closing Date:</b><br /> {props.closingDate} </span>
                </Modal.Title>
                <div
                    style={{
                        display: 'flex', 
                        width: '70%', 
                        height: '100%',
                        justifyContent: 'space-around',
                        alignSelf: 'flex-end'
                        }}>
                                <div
                                        className="delete-icon" 
                                        style={{
                                                width: 'fit-content',
                                                height: 'fit-content'
                                                }}
                                             
                                                >
                                          <div style={{ display: typeof props.comments === "undefined" ? 'none' : 'block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'red'}}></div>
                                            <img   src={comment}   
                                                style={{width: '20px', 
                                                        height: '20px'
                                                }}/>
                                                <span>Comments</span> 
                                    </div>
                                    <div
                                     className="delete-icon"    
                                     style={{
                                        width: 'fit-content',
                                        height: 'fit-content'
                                     }}>
                                    <img src={edit} 
                                      style={{width: '20px', 
                                      height: '20px'
                                    }} /> 
                                            <span>Edit</span>
                                    </div>
                                    
                                    <div
                                     className="delete-icon"    
                                     style={{
                                            width: 'fit-content',
                                            height: 'fit-content'
                                            }}
                                           
                                                >
                                      <img
                                       src={trash}   
                                       style={{
                                         width: '20px', 
                                         height: '20px'
                                        }} />
                                      <span>Delete</span>
                                    </div>   
                                  </div>
            </Modal.Header>
            <Modal.Body 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                maxHeight: '90%',
                overflowY: 'scroll'
              }}
            >
            <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <h3 style={detailTitle}>Organisation</h3>
                </div>
                <span>{props.organisation}</span>
            </div>

            <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <h3 style={detailTitle}>Status</h3>
                </div>
                <span>{props.status}</span>
            </div>
            <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <h3 style={detailTitle}>Eligibility</h3>
                </div>
                <span>{props.eligibility}</span>
            </div> 
            <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <h3 style={detailTitle}>Submission Method</h3>
                </div>
                <span>{props.submissionMethod}</span>
            </div>

            <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <h3 style={detailTitle}>Mandatory Requirements</h3>
                </div>
                <span>{props.mandatoryRequirements}</span>
            </div>

            <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <h3 style={detailTitle}>Evaluation Criteria</h3>
                </div>
                <span>{props.evaluationCriteria}</span>
            </div>

            <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <h3 style={detailTitle}>Uploaded By</h3>
                </div>
                <span>{props.uploadedBy}</span>
            </div>                
          </Modal.Body>
        </div>
        </div>
    )
}