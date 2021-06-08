import React, {useEffect, useState} from 'react';
import {Form, Button,  Popover, OverlayTrigger, Spinner} from 'react-bootstrap';
import './Login/Login.css';
import hero from './Login/data_processing.png';
import {Link} from 'react-router-dom';
import axios from 'axios';
import _CONFIG from '../../config/config';

   
class Login extends React.Component {
    state={
        isLoaded: false,
        isAdmin: false,
        loginUser: [],
        loginClicked: false,
        errorEmail: false,
        errorPassword: false,
        emailPop: 'example@example.com',
        passwordPop: 'Should be more than 6 characters',
        errorColor: 'green',
        route: ""
    }

    componentDidMount(){
        this.setState({
            isLoaded: true
        });
        localStorage.clear()
    }

    reloadPage = () => {

        window.location.reload()
    }


    authenticateUser = async () => {
        const user = {
            email: document.getElementsByName('email')[0].value,
            password:  document.getElementsByName('password')[0].value
        }

        if(user.email.length < 1 || user.password.length < 1){
            document.getElementsByName('email')[0].style.border = 'solid 1px red'
            document.getElementsByName('password')[0].style.border = 'solid 1px red'
            alert('Kindly fill all fields before logging in');
            this.reloadPage();
            return 0;
        }

        try{
            axios.post(_CONFIG.API_URI+"/api/v1/login_user", user)
            .then(res => {
                console.log('loggin in...')
                switch(res.data) {
                    case 'Email does not exist':
                        document.getElementsByName('email')[0].focus();
                        this.setState({
                        errorEmail: true,
                        loginClicked: false,
                        emailPop: res.data,
                        errorColor: 'rgb(242, 11, 63)'
                        });
                        break;
                    case 'Password invalid':
                        document.getElementsByName('password')[0].focus();
                        this.setState({
                            errorPassword: true,
                            loginClicked: false,
                            passwordPop: res.data,
                            errorColor: 'rgb(242, 11, 63)'
                        });  
                        break;
                    case 'admin':
                        this.setState({
                            loginClicked: true
                        })
                        localStorage.setItem('auth-token',  res.headers['auth-token']); 
                        window.location.href = window.location.href + 'dashboard';
                    break;

                    case 'not admin':
                        this.setState({
                            loginClicked: false
                        })
                        localStorage.setItem('auth-token',  res.headers['auth-token'])
                        localStorage.setItem('userName', user.email)
                        localStorage.setItem('userEmail', user.username) 
                        window.location.href = window.location.href + 'user-dashboard'
                    break;
                    

                    default: 
                        this.setState({
                            loginClicked: false
                        })
                }
            })
        } catch (err) { console.log(err)}
    
    }

    render() {
        if(this.state.isLoaded){

        const loadingBtn = (
            <Button variant="primary" disabled>
                <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                />
                Logging in...
            </Button>  );

        const loginBtn = (
            <Button variant="primary" type="submit" onClick={this.authenticateUser}>
                            Log in
                        </Button>  
        );

            return(
                <div className="LoginContainer">
                    <section className="left-section">
                      <Form className="login-form">
                        <Form.Group controlId="formBasicEmail">
                              <Form.Label>Email address</Form.Label>
                            <OverlayTrigger
                                trigger="focus"
                                placement='top'
                                overlay={
                                    <Popover id={`popover-positioned-top`}>
                                    <Popover.Title style={{color: this.state.errorColor, fontSize: '20px'}}></Popover.Title>
                                    <Popover.Content style={{color: this.state.errorColor}}>
                                        {this.state.emailPop}
                                    </Popover.Content>
                                    </Popover>
                                }
                                >
                            <Form.Control name="email" type="email" placeholder="Enter email" required={true}/>
                            </OverlayTrigger>
                        </Form.Group>
    
                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <OverlayTrigger
                                trigger="focus"
                                placement='top'
                                overlay={
                                    <Popover id={`popover-positioned-top`}>
                                    <Popover.Title style={{fontSize: '20px', color: 'green'}}></Popover.Title>
                                    <Popover.Content style={{color: this.state.errorColor}}>
                                        {this.state.passwordPop}
                                    </Popover.Content>
                                    </Popover>
                                }
                                >
                            <Form.Control name="password" type="password" placeholder="Password" required={true}/>
                            </OverlayTrigger>
                        </Form.Group>
                        <Link to={this.state.route} onClick={() => {
                            this.setState({
                                loginClicked: true
                            })
                        }}>
                        {
                            !this.state.loginClicked ? loginBtn : loadingBtn
                        }
                        </Link>
    
                        </Form>
                    </section>
                    <section className="right-section" style={{
                        backgroundImage: `url(${hero})`
                    }}>
    
                    </section>
                </div>
            )
        } 
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw'}}>
                 <Spinner animation="grow" />
            </div>
        )
    }
}



export default Login;