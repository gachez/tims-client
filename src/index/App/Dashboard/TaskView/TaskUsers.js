import React from 'react';
import '../../shared/TaskView.css';
import {ListGroup } from 'react-bootstrap';
import trash from '../shared/trash.png';
import users from './TaskUsers/user.png';



export default class TaskView extends React.Component{
    render(){
      const taskUsers =  this.props.taskUsers.map( user => {
            return(      <>
                <ListGroup.Item  
                    key={user._id}  
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
                      this.props.toggleMod()
                      this.props.getID(user.username)
                    }}
                  >
                  <img 
                    src={users} 
                    alt="user avatar" 
                    width="24px" 
                    height= "24px" 
                    style={{marginRight: '2rem'}} /> {user.fullname} <img 
                                            src={this.props.openTasks} 
                                            alt="open tasks" 
                                            width="24px" 
                                            height="24px" 
                                            style={{ position: 'absolute', right: '10%'}}/>
                </ListGroup.Item>
                    </>)
                    });

      return taskUsers;              
                }   
};