import React from 'react';
import users from './HomeViewAdmin/x-men.png';
import tasks from '../shared/education-m.png';
import reports from '../shared/computing.png';
import analytics from '../shared/business.png';
import tender from '../../../assets/document.png';


export default class HomeViewAdmin extends React.Component{
    
    componentDidMount(){
        if(!localStorage.getItem("page")){
            console.log('home-page-admin');
        }
        else{
            this.props.loadPage(localStorage.getItem("page"))
        }
    }

    render(){
        return(
            <>
                <div className="card-container">
                  <div className="cards" id="user-m" style={{
                            backgroundImage: `url(${users})`
                        }}
                        onClick={() => {
                            this.props.loadPage('user-management')}}
                        >
                    </div>
                    <h4 style={{fontWeight: 'bold'}}>User Management</h4>
                </div>
                <div className="card-container" >
                    <div
                     className="cards" 
                     id="tasks" 
                     style={{
                            backgroundImage: `url(${tasks})`
                        }}
                    onClick={() => {
                        this.props.loadPage('tasks')}}>
                    </div>
                    <h4 style={{fontWeight: 'bold'}}>Tasks Management</h4>
                </div>
                <div className="card-container">
                  <div className="cards" id="reports" style={{
                            backgroundImage: `url(${tender})`
                        }}
                        onClick={() => {
                            this.props.loadPage('tenders')}}
                        >
                    </div>
                    <h4 style={{fontWeight: 'bold'}}>Tender Management</h4>
                </div>
                <div className="card-container">
                  <div className="cards" id="reports" style={{
                            backgroundImage: `url(${reports})`
                        }}
                        onClick={() => {
                            this.props.loadPage('database')}}
                        >
                    </div>
                    <h4 style={{fontWeight: 'bold'}}>Database</h4>
                </div>
                <div className="card-container">
                    <div className="cards" id="analytics" style={{
                         backgroundImage: `url(${analytics})`
                        }}
                        onClick={() => {
                            this.props.loadPage('analytics')}}
                        >
                    </div>
                    <h4 style={{fontWeight: 'bold'}}>Analytics</h4>
                </div>
        </>
        )
    }
}