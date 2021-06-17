import React from 'react';
import {Nav, Table} from 'react-bootstrap';
import _CONFIG from '../../../config/config';
import dateFormat from 'dateformat';

export default function TendersView(){
    React.useEffect(() => {
        fetch(_CONFIG.API_URI+'/api/v1/tenders', {
            headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('auth-token')
          }})
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setTenders(data)})
        .catch(err => console.log(err))

    }, [])
    const [tenders, setTenders] = React.useState([])
    return(
        <div className="container">
            <h2 id="h2-title">Tenders Management</h2>
            <Nav variant="pills" defaultActiveKey="#" style={{marginTop: '2.5rem'}}>
                <Nav.Item>
                    <Nav.Link href="#">Tenders List</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Add tender</Nav.Link>
                </Nav.Item>
            </Nav>
            <Table style={{marginTop: '2rem'}} bordered striped responsive hover >
            <thead>
                                <tr>
                                <th>#</th>
                                <th>Date uploaded</th>
                                <th>Organisation</th>
                                <th>Tender Name</th>
                                <th>Eligibility</th>
                                <th>Closing date</th>
                                <th>Status</th>
                                <th>Uploaded By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tenders.reverse().map((tender, index) => {
                                        return(
                                            <tr style={{cursor: 'pointer', backgroundColor: 'red'}}>
                                                <td>{index+1}</td>
                                                <td>{dateFormat(tender.dateSeen)}</td>
                                                <td>{tender.organisation}</td>
                                                <td>{tender.tenderName}</td>
                                                <td>{tender.eligibility}</td>
                                                <td>{dateFormat(tender.closingDate)}</td>
                                                <td>{tender.status}</td>
                                                <td>{tender.uploadedBy}</td>
                                            </tr>
                                        )
                                    })                          
                                }
                            </tbody>
            </Table>
        </div>
    )
}