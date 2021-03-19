import React from 'react';
import GoogleAuth from '../../Auth/GoogleAuth';
import { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import isEqual from 'lodash.isequal';
import Cookies from 'universal-cookie';
import './Login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        const cookies = new Cookies()
        var isTrueSet = (cookies.get('signedIn') === 'true')
        this.state = {
            create: false,
            user: '',
            password: '',
            redirect: false,
            open: false,
            severity: '',
            message: '',
            standardSignIn: isTrueSet
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.createRedirectEvent = this.createRedirectEvent.bind(this)
    }

    handleClick = () => {
		this.setState({ open: true });
	};
	
	handleClose = () => {
		this.setState({ open: false });
	};

    Transition(props) {
	    return <Slide direction="up" {...props} />;
    }
    
    type = () => { //  Displays the alert
        const { open, severity, message } = this.state
        if (isEqual(severity, 'success') === true) {
			return (
				<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={this.handleClose} TransitionComponent={this.Transition} autoHideDuration={6000}>
					<Alert onClose={this.handleClose} severity={severity}>
						{message}
  					</Alert>
				</Snackbar>
			)
		} else {
			return (
				<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={this.handleClose} TransitionComponent={this.Transition} autoHideDuration={6000}>
					<Alert onClose={this.handleClose} severity={severity}>
						{message}
  					</Alert>
				</Snackbar>
			)
		}
    }

    handleSubmit(event) { //  Sends a POST request to the back end which verifies the credentials and assigns a token
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/login',
            data: {
                user: this.state.user,
                password: this.state.password
            },
            withCredentials: true
        })
        .then(response => {
            const cookies = new Cookies()
            if (response.request.response == 'true') { //  Gives the success alert and redirects the user to the home page
                this.setState({ redirect: true, open: true, severity: 'success', message: 'You have been logged in!', standardSignIn: true })
                cookies.set('signedIn', true, {path: '/'})
            }
            window.location.reload(false);
        })
            .catch((error) => {
                if (error.response.data.message == 'Invalid user/pass') { //  Gives an error alert
                    this.setState({ open: true, severity: 'error', message: 'Invalid Username/Password' })
                } else {
                    this.setState({open: true, severity: 'error', message: 'Uh oh! Something went wrong'})
                }
            })

    }

    setCookie = () => { //  Sets the signedIn cookie
        const { standardSignIn } = this.state
        const cookies = new Cookies()
        if (standardSignIn === true) {
            cookies.set('signedIn', true, {path: '/'})
        }
        else {
            cookies.set('signedIn', false, {path: '/'})
        }
    }

    add(item, type) { //  Updates the values of the text fields in the form
        if (type == 'user') {
            this.setState({ user: item.target.value })
        } else {
            this.setState({ password: item.target.value })
        }
    }

    createRedirectEvent() {
        this.setState({ create: true })
    }
    
    render() {
        const cookies = new Cookies()
        const { redirect, open, severity, message, standardSignIn, create } = this.state
        return (
            <div style={{margin: '80px'}}>
                {this.setCookie()}
                {this.type()}
                {
                    redirect && <Redirect to={{
                        pathname: '/',
                        state: { open: open, severity: severity, message: message }
                    }}/> //  Redirects to the home page
                }
                {
                    create && <Redirect to={{pathname: '/create'}} /> //  Redirects to the create account page
                }
                <div className="login-google-button">
                    <GoogleAuth ableToRedirect={true}/>
                </div>
                <div className="form"> {/* Form for Logging in */}
                    <label for="fusername">Username</label>
                    <input type="text" id="fusername" name="username" placeholder="Username" onChange={(item) => this.add(item, 'user')} />
                    <label for="lpassword">Password</label>
                    <input type="password" id="lpassword" name="password" placeholder="Password" onChange={(item) => this.add(item, 'password')} />
                    <button onClick={this.handleSubmit} className="standard-login-button">Login</button>
                    <button onClick={this.createRedirectEvent} className="standard-create-button">Create an Account</button>
                </div>
            </div>
        )
    }
}

export default Login