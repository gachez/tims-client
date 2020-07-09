import React from 'react';
import './HomeViewUser/HomeViewUSer.css';
import tasks from '../shared/education-m.png';
import reports from '../shared/computing.png';
import analytics from '../shared/business.png';

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
                <>
                 <div className="cards" id="tasks" style={{
                            backgroundImage: `url(${reports})`
                        }}
                        onClick={() => {
                            this.props.loadPage('tasks')}}
                        >
    
                    <div className="tasks-count">{taskCount}</div>
                        </div>
                    <div className="cards" id="reports-user" style={{
                            backgroundImage: `url(${tasks})`,
                            top: '15%'
                        }}
                        onClick={() => {
                            this.props.loadPage('reports')}}
                        >
                        </div>
                       
                </>
            ) 
        }
        return null
    }
}