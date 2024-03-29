import React from 'react';
import {Modal} from 'react-bootstrap';
import organization from '../../../assets/organization.png';
import factory from '../../../assets/factory.png';
import user from '../../../assets/user.png';
import web from '../../../assets/www.png';
import phone from '../../../assets/phone.png';
import suitcase from '../../../assets/suitcase.png';
import email from '../../../assets/email.png';
import location from '../../../assets/location.png';
import project from '../../../assets/layers.png';
import calendar from '../../../assets/calendar.png';
import submission from '../../../assets/directory.png';
import trash from '../Dashboard/shared/trash.png';
import edit from '../shared/edit.png';
import comment from '../shared/chatbox.png';
import tick from '../../App/shared/tick.png';

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
  paddingLeft: '8px',
  textDecoration: 'underline'
}

const detailText = {
  fontSize: '1rem',
  color: '#000',
  lineBreak: 'anywhere'
}

/*
                               <div
                                        key={user.password} 
                                        className="delete-icon" 
                                        style={{ 
                                                 position: 'absolute',
                                                 left: '-135px',
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

                                     <img  key={user} src={tick} style={{marginLeft: '-35px'}} className="delete-icon" onClick={() => {
                                          window.scrollTo(0, 0);
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
                                         window.scrollTo(0, 0);
                                        this.setState({
                                            editFieldID: user._id
                                        });
                                        this.toggleEditModalDisplay()
                                    }}/>
*/

function DetailsModal(props) {
    return (
      <div style={{ 
        position: 'fixed',
        width: '100%',
        left: 0,
        top: 0,
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 99,
        display: props.show ? 'flex' : 'none'
      }}>
         <div style={{backgroundColor: 'white', margin: 'auto', width: '60%', height: 'auto', borderRadius: 8}}>
         <Modal.Header closeButton onClick={() => props.handleClose()}>
                <Modal.Title style={{fontSize: '1.35rem', fontWeight: 'bolder', width: '100%',textAlign: 'left'}} > {props.contactPerson}: {props.designation} - {props.organisation}({props.industry}) </Modal.Title>
                <div
                                     style={{
                                         display: 'flex', 
                                         width: '70%', 
                                         justifyContent: 'space-around'}}>
                                    <div
                                        className="delete-icon" 
                                        style={{
                                                width: 'fit-content',
                                                height: 'fit-content'
                                                }}
                                        onClick={() => {
                                          props.handleComments(props.id)   
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
                                     }}
                                      
                                     onClick={() => {
                                      props.handleEdits(props.id)
                                      }}
                                                           >
                                    <img src={edit} 
                                      style={{width: '20px', 
                                      height: '20px'
                                    }} /> 
                                            <span>Edit</span>
                                    </div>
                                    
                                    <div
                                     className="delete-icon"
                                     style={{
                                       display: !props.handleConfirm ? 'none' : 'block',
                                       width: 'fit-content',
                                       height: 'fit-content'
                                     }}
                                     > 
                                    <img  key={user} src={tick} onClick={() => console.log('m')}/>
                                     <span>Closed</span>
                                    </div>

                                    <div
                                     className="delete-icon"    
                                     style={{
                                            width: 'fit-content',
                                            height: 'fit-content'
                                            }}
                                      onClick={() => {
                                        props.handleDelete(props.id)
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
                gridTemplateColumns: '1fr 1fr 1fr',
                maxHeight: '90%',
                overflowY: 'scroll'
              }}
            >
               <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img src={user} alt="contact person" width="24px" height="24px"  />
                  <h3 style={detailTitle}>Contact Person</h3>
                </div>
                <span style={detailText}>{props.contactPerson}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="Contact telephone" src={phone} width="24px" height="24px"  />
                  <h3 style={detailTitle} >Contact Tel</h3>
                </div>
                <span style={detailText} >{props.telephone}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="Email address" src={email} width="24px" height="24px"  />
                  <h3 style={detailTitle} >Email Address</h3>
                </div>
                <span style={detailText} ><a href={`mailto:${props.emailAddress}`}>{props.emailAddress}</a></span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="Designation" src={suitcase} width="24px" height="24px"  />
                  <h3 style={detailTitle}>Designation</h3>
                </div>
                <span style={detailText}>{props.designation}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img src={organization} alt="org" width="24px" height="24px"   />
                  <h3 style={detailTitle}>Organisation</h3>
                </div>
                <span style={detailText}>{props.organisation}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img src={factory} alt="ind" width="24px" height="24px"  />
                  <h3 style={detailTitle} >Industry</h3></div>
                <span style={detailText} >{props.industry}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="website" src={web} width="24px" height="24px"  />
                  <h3 style={detailTitle}>Website</h3>
                </div>
                 <span style={detailText}><a href={props.website}>{props.website}</a></span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="Organisation Contacts" src={phone} width="24px" height="24px"  />
                  <h3 style={detailTitle}>Org Contacts</h3>
                </div>
                <span style={detailText}>{props.contacts}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="location" src={location} width="24px" height="24px"  />
                  <h3 style={detailTitle} >Physical Location</h3>
                </div>
                <span style={detailText} >{props.physicalLocation}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="Project name" src={project} width="24px" height="24px"  />
                <h3 style={detailTitle}>Project Name</h3>
                </div>
                <span style={detailText}>{props.projectName}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="submission time" src={calendar} width="24px" height="24px" />
                  <h3 style={detailTitle}>Submission Time</h3>
                </div>
                <span style={detailText}>{props.collectionTime}</span>
              </div>
              <div style={detailCard}>
                <div style={{display: 'flex',width: 'fit-content', alignItems: 'center'}}>
                  <img alt="submission time" src={submission} width="24px" height="24px" />
                  <h3 style={detailTitle}>Submitted By</h3>
                </div>
                <span style={detailText}>{props.submittedBy}</span>
              </div>
              </Modal.Body>
         </div>
      </div>
    );
  }

export default DetailsModal;