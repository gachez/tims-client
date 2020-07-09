import React from 'react';
import '../shared/TaskView.css';
import {ListGroup } from 'react-bootstrap';
import users from './TaskView/TaskUsers/user.png';
import analytics from '../../../assets/statistics.png';



export default class ProjectsLis extends React.Component{
    render(){
      const project =  this.props.projectsL.map( proj => {
            return(      <>
                <ListGroup.Item   
                    key={proj._id}  
                    className="assignees-list" 
                    style={{ 
                        fontSize: '18px', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignContent: 'space-around', 
                        color: 'black'
                        }} 
                    variant="light" 
                    onClick={() => {
                      localStorage.setItem('id', proj._id)
                      this.props.openAnalytics('analyzeProjects')
                    }}
                  >
                    {proj.projectName} 
                    <img 
                        src={analytics} 
                        alt="open tasks" 
                        width="24px" 
                        height="24px" 
                        style={{ position: 'absolute', right: '10%'}}/>
                </ListGroup.Item>
                    </>)
                    });

      return project;              
                }   
};