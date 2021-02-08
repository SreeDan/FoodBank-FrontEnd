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
        console.log(isTrueSet)
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
    
    type = () => {
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

    handleSubmit(event) {
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
            if (response.request.response == 'true') {
                this.setState({ redirect: true, open: true, severity: 'success', message: 'You have been logged in!', standardSignIn: true })
                cookies.set('signedIn', true)
            }
            console.log(response.request.response)
            console.log(this.state.redirect)
            window.location.reload(false);
        })
            .catch((error) => {
                console.log(error.response.data.message)
                if (error.response.data.message == 'Invalid user/pass') {
                    this.setState({ open: true, severity: 'error', message: 'Invalid Username/Password' })
                } else {
                    this.setState({open: true, severity: 'error', message: 'Uh oh! Something went wrong'})
                }
            })

    }

    setCookie = () => {
        const { standardSignIn } = this.state
        const cookies = new Cookies()
        console.log(standardSignIn)
        if (standardSignIn === true) {
            cookies.set('signedIn', true)
        }
        else { cookies.set('signedIn', false) }
    }

    add(item, type) {
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
                {console.log(create)}
                {
                    redirect && <Redirect to={{
                        pathname: '/',
                        state: { open: open, severity: severity, message: message }
                    }}/>
                }
                {
                    create && <Redirect to={{pathname: '/create'}} />
                }
                <div className="login-google-button">
                    <GoogleAuth ableToRedirect={true}/>
                </div>
                <div className="form">
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