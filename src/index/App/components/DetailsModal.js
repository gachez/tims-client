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
  paddingLeft: '8px'
}

const detailText = {
  fontSize: '1rem',
  color: '#000',
  lineBreak: 'anywhere'
}

function DetailsModal(props) {
    return (
      <div style={{ 
        position: 'fixed',
        width: '100%',
        left: 0,
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 99,
        display: props.show ? 'flex' : 'none'
      }}>
         <div style={{backgroundColor: 'white', margin: 'auto', width: '60%', height: 'auto', borderRadius: 8}}>
         <Modal.Header closeButton onClick={() => props.handleClose()}>
                <Modal.Title style={{fontSize: '1.35rem', fontWeight: 'bolder', width: '100%',textAlign: 'left'}} > {props.contactPerson}: {props.designation} - {props.organisation}({props.industry}) </Modal.Title>
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
              </Modal.Body>
         </div>
      </div>
    );
  }

export default DetailsModal;