import React from 'react';
import './MessagesView/MessagesView.css';
import {Container, Row, Col, Card, Form, Media} from 'react-bootstrap';
import usera from './MessagesView/social-media.png';
import userw from '../shared/social-media-white.png';
import send from './MessagesView/send.png';

const usersMessages = [
    {
        name: "James G",
        message: "koko"
    },
    {
        name: "Mary Sue",
        message: "mcmkxkcjkjczjkijoc"
    },
    {
        name: "Ciku Mungai",
        message: "odpjdasojdsapojadspjadso"
    },
    {
        name: "Njeri Susan",
        message: "loskonycucydgd"
    },

    {
        name: "Njeri Susan",
        message: "loskonycucydgd"
    },

    {
        name: "Njeri Susan",
        message: "loskonycucydgd"
    }
];

export default class MessagesView extends React.Component{
    render(){
        return(
            <div className="container">
                <h2>Messages</h2>
                <Container className="messages-container" fluid>
                  <Row>
                    <Col>
                    <Form style={{margin: '1rem'}} variant="dark">
                        <Form.Control type="textbox" className="search-messages"id="search-messages"  placeholder="search message.." ></Form.Control>
                    </Form>
                    <>
                    {
                        usersMessages.map( (message,index) => {
                            return(
                               <>
                               <Card key={index}  style={{ cursor: 'pointer', width: '100%', boxShadow: '4px 4px rgba(0,0,0,0.2)', borderRadius: '15px' }}>
                                <Card.Body>
                            <Card.Title>{message.name}</Card.Title>
                                <Card.Text>
                                    {message.message}
                                </Card.Text>
                                <Card.Footer>
                                <small className="text-muted">Recieved 3 mins ago</small>
                                </Card.Footer>
                                </Card.Body>
                            </Card>
                            <br />
                            </>
                            )
                        })
                    }
                       
                        </>
                    </Col>
                    <Col style={{borderLeft: 'solid 1px rgba(0,0,0,0.1)'}}>
                       <div className="chat-header"><h3>James G (user)</h3><img src={send} style={{
                           position: 'absolute',
                           right: '2rem',
                           cursor: 'pointer'
                       }}alt="send icon" width="28px" height="28px"/></div>
                        <div className="chat-section">
                        <ul className="list-unstyled" style={{marginTop: '2.5rem'}}>
                            <Media as="li" className="message">
                                <img
                                width={64}
                                height={64}
                                style={{borderRadius: '50%'}}
                                className="mr-3"
                                src={usera}
                                alt="User Placeholder"
                                />
                                <Media.Body>
                                <h5>12:05 pm</h5>
                                <p>
                                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                                    ante sollicitudin commodo. 
                                </p>
                                </Media.Body>
                            </Media>
                            <br />
                            <Media as="li" className="message recieved">
                                <img
                                width={64}
                                height={64}
                                style={{borderRadius: '50%'}}
                                className="mr-3"
                                src={userw}
                                alt="Generic placeholder"
                                />
                                <Media.Body>
                                <h5>12:15 pm</h5>
                                <p>
                                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                                    ante sollicitudin commodo. 
                                </p>
                                </Media.Body>
                            </Media>
                            

                            </ul>
                        </div>
                    </Col>
                </Row>
                </Container>
            </div>
        )
    }
}