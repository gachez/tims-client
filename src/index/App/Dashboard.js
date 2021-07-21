import React from 'react';
import axios from 'axios';
import './shared/Dashboard.css';
import {Spinner} from 'react-bootstrap';
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import HomeViewAdmin from './Dashboard/HomeViewAdmin';
import UserManagement from './Dashboard/UserManagementView';
import TaskView from './Dashboard/TaskView';
import ReportsView from './Dashboard/ReportsView'; 
import AnalyticsView from './Dashboard/AnalyticsView';
import AnalyticsProjects from './Dashboard/AnalyticsProjects';
import MessagesView from './Dashboard/MessagesView';
import avatar from './shared/social-media-white.png';
import { Link } from 'react-router-dom';
import TendersView from './Dashboard/TendersView';
import _CONFIG from '../../config/config';

// This is the admin dashboard
const userAvatar = {
    display: 'grid',
    gap: '16px',
    marginTop: '6.5rem'
  };
  
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;  

class Dashboard extends React.Component {
    state={
        isLoaded: false,
        active: '',
        borderActive: 'none',
        collapsed: false,
    }

    componentDidMount() {
        axios.get(_CONFIG.API_URI+"/api/v1/admin/get_users",  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          })
          .then(res => {
            this.setState({
                isLoaded: true,
                active: 'home',
                loggedInUSer: res.data.filter(user => user.email.toLowerCase() === localStorage.getItem('userName')).map(user => user.username)
            }); 
        
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
                return <HomeViewAdmin  loadPage={this.setPage}/>

            case 'user-management':
                return <UserManagement loadPage={this.setPage} />
                
            case 'tasks':
                return <TaskView loadPage={this.setPage} />

            case 'tenders':
                return <TendersView loggedInUSer={this.state.loggedInUSer} />
                
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

    
      onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
      };

  
    render() {
        if(this.state.isLoaded) {
            return(
                <Layout style={{ minHeight: '100vh' }}>
                            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} >
                                <div style={{ color: "#fff", marginTop: '2rem', marginBottom: '2rem', padding: '1.5rem', fontWeight: 'bolder', fontSize: '1.5rem' }}>Information System v.1.0.0</div>
                                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" >
                                    <Menu.Item key="1" onClick={
                                        () => {
                                            localStorage.setItem('page', 'home')
                                            this.setState({
                                                active: "home"
                                            })
                                        }
                                    }>Home</Menu.Item>
                                    <Menu.Item key="2" 
                                     onClick={
                                        () => {
                                            localStorage.setItem('page', 'user-management');
                                            this.setState({
                                                active: "user-management"
                                            });
                                        }
                                    }>User Management</Menu.Item>
                                    <Menu.Item key="3"
                                    onClick={
                                        () => {
                                            localStorage.setItem('page', 'tasks');
                                            this.setState({
                                                active: "tasks"
                                            })
                                        }
                                    }>Tasks management</Menu.Item>

                                    <Menu.Item key="4" 
                                        onClick={
                                            () => {
                                                localStorage.setItem('page', 'tenders');
                                                this.setState({
                                                active: "tenders"
                                            })
                                        }
                                    }>Tenders management</Menu.Item>

                                    <Menu.Item key="5" 
                                    onClick={
                                        () => {
                                            localStorage.setItem('page', 'database');
                                            this.setState({
                                                active: "database"
                                            })
                                        }
                                    }>Database</Menu.Item>
                                    <Menu.Item key="6" 
                                    onClick={
                                        () => {
                                            localStorage.setItem('page', 'analytics');
                                            this.setState({
                                                active: "analytics"
                                            })
                                        }
                                    }>Analytics</Menu.Item>
                                  

                        <Menu.Item key="7" style={{ marginTop: '5rem' }} >
                            <span><img src={avatar} width="24px" height="24px" alt="user avatar" style={{margin: '.25rem'}}/></span>
                            <Link to={"/"}><span>Log out</span></Link>
                            </Menu.Item>
                        </Menu>
                         </Sider>
                        <Layout style={{ height:'auto' }}>
                            <Content style={{width: "100%" }}> 
                            {
                                this.determineActivePage(this.state.active)
                            }
                        </Content>
                        </Layout>

                </Layout>
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