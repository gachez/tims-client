import React from 'react';
import './shared/Dashboard.css';
import {Link} from 'react-router-dom';
import HomeViewUser from './UserDashboard/HomeViewUser';
import TaskViewUser from './UserDashboard/TasksViewUser';
import ReportsViewUser from './UserDashboard/ReportsViewUser';
import TendersView from './Dashboard/TendersView';
import axios from 'axios';
import avatar from './shared/social-media-white.png';
import _CONFIG from '../../config/config';

const userAvatar = {
    display: 'grid',
    gap: '16px',
    marginTop: '6.5rem'
  };

class UserDashboard extends React.Component {
    state={
        isLoaded: false,
        active: 'home',
        borderActive: 'none',
        tasks: [],
        loggedInUSer: {},
        getUsersRequest: axios.get(_CONFIG.API_URI+"/api/v1/admin/assigned_tasks",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }),
        getTasksRequest: axios.get(_CONFIG.API_URI+"/api/v1/admin/get_users",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          })
    }
    
    componentDidMount() {
        axios.all([this.state.getUsersRequest, this.state.getTasksRequest]).then(axios.spread((...responses) => {
            this.setState({
                isLoaded: true,
                tasks: responses[0].data,
                loggedInUSer: responses[1].data.filter(user => user.email.toLowerCase() === localStorage.getItem('userName')).map(user => user.username)
            })            // use/access the results 
          })).catch(errors => {
            // react on errors.
            return errors
          })

    }  

    setPage = (page) => {
        this.setState({
            active: page
        })
    }


    determineActivePage = (page) => {
        switch(page) {
            case 'home':
                return <HomeViewUser loadPage={this.setPage} userTasks={this.state.tasks} userLoggedIn={this.state.loggedInUSer[0]} />

            case 'tasks':
                return <TaskViewUser loadPage={this.setPage} userTasks={this.state.tasks} userLoggedIn={this.state.loggedInUSer[0]} />

            case 'reports': 
                return <ReportsViewUser loadPage={this.setPage} userTasks={this.state.tasks} userLoggedIn={this.state.loggedInUSer[0]}/>   
                
            case 'tenders':
                return <TendersView loggedInUSer={this.state.loggedInUSer} />
                                
          
        }
    }

  

    render() {
        console.log(this.state.loggedInUSer[0])
        return(
            <div id="container" fluid={true} style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'space-between'}}>
                
                    <section className="sidebar">
                        <div id="brand-title">Information System v.1.0.0</div>
                        <div className="navigation">
                            <div id="home-menu" 
                            style={{
                                borderBottom: this.state.active === 'home' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                            }}
                            onClick={
                                () => {
                                    this.setState({
                                        active: "home"
                                    })
                                    localStorage.setItem("page", "home")
                                }
                            }>Home</div>
                            <div id="tasks-management-menu" 
                            style={{
                                borderBottom: this.state.active === 'tasks' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                            }}
                            onClick={
                                () => {
                                    this.setState({
                                        active: "tasks"
                                    });
                                    
                                }
                            }>Task Management</div>
                           <div id="tender-management-menu" 
                            style={{
                                borderBottom: this.state.active === 'tenders' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                            }}
                            onClick={
                                () => {
                                    this.setState({
                                        active: "tenders"
                                    });
                                    
                                }
                            }>Tender Management</div>
                            <div id="database-menu" 
                            style={{
                                borderBottom: this.state.active === 'reports' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                            }}
                            onClick={
                                () => {
                                    this.setState({
                                        active: "reports"
                                    })
                                }
                            }>Database</div>
                     
                     <div style={userAvatar}>
                        <span><img src={avatar} width="24px" height="24px" alt="user avatar" style={{margin: '.25rem'}}/> {this.state.loggedInUSer[0]}</span>
                        <Link to={"/"}><span>Log out</span></Link>
                        </div>
                        
                            </div>
                        </section>
                        <section className="body-container"> 
                            {
                                this.determineActivePage(this.state.active)
                            }
                    </section>
                
            </div>
        )
    }
}

export default UserDashboard;