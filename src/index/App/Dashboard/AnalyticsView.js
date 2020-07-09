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
        project: []
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
     
        const usersCountArr = this.state.project.usersAssigned
        
const KPIs = [
    {
        title: "Users",
        amount: 4
    },
    {
        title: "Tasks Assigned",
        amount: 30
    },
    {
        title: "Tasks Submitted",
        amount: 111
    },
    {
        title: "Companies Recorded",
        amount: 1000
    },
    {
        title: "Confirmed",
        amount: 330
    },
    {
        title: "Pending",
        amount: 100
    },
    {
        title: "Reports Submitted",
        amount: 20
    }
];


        if (this.state.isLoaded) {
           console.log(this.state.project)
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