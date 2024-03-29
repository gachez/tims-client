import React from 'react';
import { Card, CardDeck } from 'react-bootstrap';
import './AnalyticsView/AnalyticsView.css';
import CanvasJSReact from './AnalyticsView/canvasjs.react';
import axios from 'axios';
import {Spinner} from 'react-bootstrap';
import _CONFIG from '../../../config/config';


export default class AnalyticsView extends React.Component{
    state = {
        isLoaded: false,
        project: [],
        reports: [],
        tasks: []
    }

    componentDidMount() {
        axios.get(`${_CONFIG.API_URI}/api/v1/admin/get_projects/${ localStorage.getItem('id')}` ,  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {

            this.setState({
                isLoaded: true,
                project: res.data
            })
          }).catch(err => console.log(err));
    
          axios.get(`${_CONFIG.API_URI}/api/v1/admin/get_reports` ,  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {

            this.setState({ 
                reports: res.data
            })
          }).catch(err => console.log(err));
    
          axios.get(`${_CONFIG.API_URI}/api/v1/admin/assigned_tasks` ,  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {

            this.setState({
                tasks: res.data
            })
          }).catch(err => console.log(err));
          localStorage.setItem("page", "analytics")
        }

  
      
    render() {
        if (this.state.isLoaded) {
          const tasksAssignedCount = this.state.tasks.filter(task => task.projectName === this.state.project.projectName);
          const companiesRecorded = this.state.reports.filter(report => report.projectName === this.state.project.projectName);
           const KPIs = [
              
               {
                   title: "Tasks Assigned",
                   amount: tasksAssignedCount.length
               },
               {
                   title: "Tasks Completed",
                   amount: tasksAssignedCount.filter(task => task.complete).length
               },
               {
                   title: "Companies Recorded",
                   amount: companiesRecorded.length
               },
               {
                   title: "Confirmed",
                   amount: companiesRecorded.filter(record => record.confirmed).length
               },
               {
                   title: "Pending",
                   amount: companiesRecorded.filter(record => !record.confirmed ).length
               }
           ];
           
           
            return (
                <>
                <div className="container">
    
                <h2>Analytics ({this.state.project.projectName})</h2>
                <br />
                <h4>{typeof this.state.project.duration === "undefined" ? 'duration not specified' : this.state.project.duration}</h4>
                <br />
                <br />
                <CardDeck >
                    {
                        KPIs.map( kpm => {
                            return(
                                <Card>
                                    <Card.Body>
                                    <Card.Text>{kpm.title}</Card.Text>
                                    <Card.Text>
                                    <h3>{kpm.amount}</h3>
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
    
                            )
                        })
                    }                
                    </CardDeck>
                    <br />
                    <br />     
                </div>
                           </>
            )
        }
       return (
        <div className="spinner-bg">
            <Spinner id="spinner" animation="grow" />
        </div>
        );;
    }
}