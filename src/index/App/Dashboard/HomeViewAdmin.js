import React from 'react';

import users from './HomeViewAdmin/x-men.png';
import tasks from '../shared/education-m.png';
import reports from '../shared/computing.png';
import analytics from '../shared/business.png';


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
                    <div className="cards" id="user-m" style={{
                            backgroundImage: `url(${users})`
                        }}
                        onClick={() => {
                            this.props.loadPage('user-management')}}
                        ></div>
                    <div className="cards" id="tasks" style={{
                            backgroundImage: `url(${tasks})`
                        }}
                        onClick={() => {
                            this.props.loadPage('tasks')}}
                        ></div>
                    <div className="cards" id="reports" style={{
                            backgroundImage: `url(${reports})`
                        }}
                        onClick={() => {
                            this.props.loadPage('database')}}
                        ></div>
                    <div className="cards" id="analytics" style={{
                         backgroundImage: `url(${analytics})`
                        }}
                        onClick={() => {
                            this.props.loadPage('analytics')}}
                        ></div>
            </>
        )
    }
}