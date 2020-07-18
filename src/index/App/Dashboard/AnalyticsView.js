import React from 'react';
import { Card, CardDeck } from 'react-bootstrap';
import './AnalyticsView/AnalyticsView.css';
import CanvasJSReact from './AnalyticsView/canvasjs.react';
import axios from 'axios';
import {Spinner} from 'react-bootstrap';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;



export default class AnalyticsView extends React.Component{
    state = {
        isLoaded: false,
        project: [],
        reports: [],
        tasks: []
    }

    componentDidMount() {
        axios.get(`https://a123ef.df.r.appspot.com/api/v1/admin/get_projects/${ localStorage.getItem('id')}` ,  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {

            this.setState({
                isLoaded: true,
                project: res.data
            })
          }).catch(err => console.log(err));
    
          axios.get(`https://a123ef.df.r.appspot.com/api/v1/admin/get_reports` ,  {
            headers: {
              'auth-token': `${localStorage.getItem('auth-token')}`
            }
          }).then(res => {

            this.setState({
                reports: res.data
            })
          }).catch(err => console.log(err));
    
          axios.get(`https://a123ef.df.r.appspot.com/api/v1/admin/assigned_tasks` ,  {
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
        const options = {
			title: {
				text: "Tasks Analytics"
			},
			data: [
			{
				type: "column",
				dataPoints: [
					{ label: "Jan",  y: 10  },
					{ label: "Feb", y: 15  },
					{ label: "March", y: 25  },
					{ label: "April",  y: 30  },
                    { label: "May",  y: 28  },
                    { label: "June",  y: 26  },
                    { label: "July",  y: 60  }

				]
			}
			]
        }
        if (this.state.isLoaded) {
           console.log(this.state.reports);
           console.log(this.state.tasks);
        
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
                    <br />
                    <CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
        
     
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