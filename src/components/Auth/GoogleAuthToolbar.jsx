import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import Token from './GToken';
import GoogleButton from 'react-google-button';
import Cookies from 'universal-cookie';
import DeleteToken from './DeleteToken';
import axios from 'axios';

class GoogleAuthToolbar extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            isSignedIn: null,
            ableToRedirect: false,
            redirect: false,
            open: false,
            severity: '',
            message: '',
            deleteCookie: false,
            signOutRedirect: false
        }
        try {
            this.props.ableToRedirect = this.state.ableToRedirect
            console.log(this.props.ableToRedirect)
            console.log(this.state.open)
        } catch (error)  {}
    }
  
    clearCookies = () => {
        axios({
            method: 'get',
            url: 'http://localhost:8080/api/v1/company/clear',
            data: [],
            withCredentials: true
        })
        .catch(error => {
            console.log(error)
        })
    }

    componentDidMount() {
        window.gapi.load('client:auth2', () => {
            window.gapi.client
            .init({
                clientId: 'your-client-id',
                scope: 'email',
            })
            .then(() => {
                this.auth = window.gapi.auth2.getAuthInstance()
                this.handleAuthChange()
                this.auth.isSignedIn.listen(this.handleAuthChange)
                
            });
        });
    }
  
    handleAuthChange = () => {
        this.setState({ isSignedIn: this.auth.isSignedIn.get() });
        this.setState({ redirect: this.auth.isSignedIn.get() })
    };
  
    handleSignIn = () => {
        const cookies = new Cookies()
        cookies.set('gsignedIn', true)
        this.auth.signIn()
        this.setState({ redirect: true, open: true, severity: 'success', message: 'You have been logged in!' })
        window.location.reload();
    };

    handleSignOut = () => {
        const cookies = new Cookies()
        cookies.set('gsignedIn', false)
        this.setState({ deleteCookie: true })
        this.setState({ signOutRedirect: true })
        this.auth.signOut()
        this.clearCookies()
        window.location.reload(false);
    };
  
    renderAuthButton = () => {
        if (this.state.isSignedIn) {
            return (
            <div>
                <button onClick={this.handleSignOut}>Sign Out</button>
                <Token token={this.auth.currentUser.get().getAuthResponse().id_token} />
            </div>
            )
        } else if (this.state.isSignedIn === null) {
            return <div>Sign In</div>;
        } else {
            return <a href="/login">Sign In</a>
        }
    }

    delete = () => {
        const {deleteCookie} = this.state
        if (deleteCookie) {
            this.setState({ deleteCookie: false })
            return <DeleteToken />
        }
    }

    render() {
        const { open, severity, message, deleteCookie } = this.state
        return (
            <div className="login-button">
                {this.renderAuthButton()}
                {   
                    (this.props.ableToRedirect && this.state.isSignedIn) && <Redirect to={{
                        pathname: '/',
                        state: { open: open, severity: severity, message: message, refresh: true }
                    }} />
                }
                {this.delete()}
            </div>
        )
    }
}
  
  export default GoogleAuthToolbar;