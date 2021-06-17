import React from 'react';
import './HomeViewUser/HomeViewUSer.css';
import tasks from '../shared/education-m.png';
import reports from '../shared/computing.png';
import analytics from '../shared/business.png';
import tenders from '../../../assets/directory.png';

export default class HomeViewAdmin extends React.Component{
        state={
            isLoaded: false
        }
        
        componentDidMount(){
            this.setState({
                isLoaded: true
            });

            if(!localStorage.getItem("page")){
                console.log('home-page-user');
            }
            else{
                this.props.loadPage(localStorage.getItem("page"))
            }

        } 

    render(){
        if(this.state.isLoaded){
            const taskCount = this.props.userTasks.filter(task => task.userAssigned === this.props.userLoggedIn).length;
            console.log(taskCount)
            
            return(
                <div className="home-user-container">
                 <div className="card-container">  
                 <div className="cards" id="tasks" style={{
                            backgroundImage: `url(${tasks})`
                        }}
                        onClick={() => {
                            this.props.loadPage('tasks')}}
                        >
                            
                <div className="tasks-count">{taskCount}</div>
                        </div>
                        
                    <h4 style={{fontWeight: 'bold'}}>Tasks Management</h4>        
                     </div>
                         
                <div className="card-container">  
                 <div className="cards" id="tenders" style={{
                            backgroundImage: `url(${tenders})`
                        }}
                        onClick={() => {
                            this.props.loadPage('tenders')}}
                        >               
                     </div>
                    <h4 style={{fontWeight: 'bold'}}>Tender Management</h4>   
                </div>       
                <div className="card-container">
                    <div className="cards" id="reports-user" style={{
                            backgroundImage: `url(${reports})`,
                            top: '15%'
                        }}
                        onClick={() => {
                            this.props.loadPage('reports')}}
                        >
                        </div>
                    <h4 style={{fontWeight: 'bold'}}>Database</h4>    
                </div>       
                </div>
            ) 
        }
        return null
    }
}