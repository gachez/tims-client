import React from 'react';
import './shared/Dashboard.css';
import {Spinner} from 'react-bootstrap';
import HomeViewAdmin from './Dashboard/HomeViewAdmin';
import UserManagement from './Dashboard/UserManagementView';
import TaskView from './Dashboard/TaskView';
import ReportsView from './Dashboard/ReportsView'; 
import AnalyticsView from './Dashboard/AnalyticsView';
import AnalyticsProjects from './Dashboard/AnalyticsProjects';
import MessagesView from './Dashboard/MessagesView';
import avatar from './shared/social-media-white.png';
import { Link } from 'react-router-dom';

// This is the admin dashboard
const userAvatar = {
    display: 'grid',
    gap: '16px'
  };
  
class Dashboard extends React.Component {
    state={
        isLoaded: false,
        active: '',
        borderActive: 'none'  }

    componentDidMount() {
        this.setState({
            isLoaded: true,
            active: 'home'
        }); 
    }

    setPage = (page) => {
        this.setState({
            active: page
        })
    }

    determineActivePage = (page) => {
        switch(page) {
            case 'home':
                return <HomeViewAdmin  loadPage={this.setPage}/>

            case 'user-management':
                return <UserManagement loadPage={this.setPage} />
                
            case 'tasks':
                return <TaskView loadPage={this.setPage} />
                
            case 'database':
                return <ReportsView loadPage={this.setPage} />
                
            case 'analytics':
                return <AnalyticsProjects loadPage={this.setPage} /> 
                
            case 'messages':
                return <MessagesView loadPage={this.setPage} />    

            case 'analyzeProjects':
                return <AnalyticsView loadPage={this.setPage} />    
        }
    }

  
    render() {
        if(this.state.isLoaded) {

            return(
                <div id="container" style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'space-between'}}>
                            <section className="sidebar">
                                <div id="brand-title">Information System v.1.0.0</div>
                                <div className="navigation">
                                    <div id="home-menu" style={{
                                        borderBottom: this.state.active === 'home' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                                    }} onClick={
                                        () => {
                                            localStorage.setItem('page', 'home')
                                            this.setState({
                                                active: "home"
                                            })
                                        }
                                    }>Home</div>
                                    <div id="user-management-menu" 
                                    style={{
                                        borderBottom: this.state.active === 'user-management' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                                    }}
                                    onClick={
                                        () => {
                                            localStorage.setItem('page', 'user-management');
                                            this.setState({
                                                active: "user-management"
                                            });
                                        }
                                    }>User Management</div>
                                    <div id="tasks-menu" 
                                    style={{
                                        borderBottom: this.state.active === 'tasks' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                                    }}
                                    onClick={
                                        () => {
                                            localStorage.setItem('page', 'tasks');
                                            this.setState({
                                                active: "tasks"
                                            })
                                        }
                                    }>Tasks</div>

                                    <div id="tenders-menu" 
                                        style={{
                                            borderBottom: this.state.active === 'tenders' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                                        }}
                                        onClick={
                                            () => {
                                                localStorage.setItem('page', 'tenders');
                                                this.setState({
                                                active: "tenders"
                                            })
                                        }
                                    }>Tenders</div>

                                    <div id="reports-menu" 
                                    style={{
                                        borderBottom: this.state.active === 'database' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                                    }}
                                    onClick={
                                        () => {
                                            localStorage.setItem('page', 'database');
                                            this.setState({
                                                active: "database"
                                            })
                                        }
                                    }>Database</div>
                                    <div id="analytics-menu" 
                                    style={{
                                        borderBottom: this.state.active === 'analytics' ? 'solid 1px rgba(255,255,255,0.6)' : 'none'
                                    }}
                                    onClick={
                                        () => {
                                            localStorage.setItem('page', 'analytics');
                                            this.setState({
                                                active: "analytics"
                                            })
                                        }
                                    }>Analytics</div>
                                  

                        <div style={userAvatar}>
                            <span><img src={avatar} width="24px" height="24px" alt="user avatar" style={{margin: '.25rem'}}/></span>
                            <Link to={"/"}><span>Log out</span></Link>
                            </div>
                        </div>
                         </section>
                        <div style={{flexGrow: 1, display: 'flex', height:'auto'}}>
                            <section className="body-container"> 
                            {
                                this.determineActivePage(this.state.active)
                            }
                        </section>
                        </div>

                </div>
            )
        }
       
        return (
            <div className="spinner-bg">
                <Spinner id="spinner" animation="grow" />
            </div>
            );
    }
}

export default Dashboard;