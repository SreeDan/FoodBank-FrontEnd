import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import Token from './GToken';
import GoogleButton from 'react-google-button';
import Cookies from 'universal-cookie';
import DeleteToken from './DeleteToken';

class GoogleAuth extends Component {
    
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
  
    update() {
        this.forceUpdate()
    }

    componentDidMount() {
        const cookies = new Cookies()
        
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
        const cookies = new Cookies()
        cookies.set("gsignedIn", this.auth.isSignedIn.get())
        this.setState({ isSignedIn: this.auth.isSignedIn.get() });
        this.setState({ redirect: this.auth.isSignedIn.get() })
    };
  
    handleSignIn = () => {
        const cookies = new Cookies()
        cookies.set('gsignedIn', true)
        this.auth.signIn().then(() => {
            window.location.reload()
        })
        this.setState({ redirect: true, open: true, severity: 'success', message: 'You have been logged in!' })
    };
    
    redirect() {
        const { signOutRedirect } = this.state
        if (signOutRedirect) {
            this.setState({ signOutRedirect: false })
            return <Redirect to="/login" />
        }
    }

    handleSignOut = () => {
        const cookies = new Cookies()
        cookies.set('gsignedIn', false)
        this.setState({ deleteCookie: true })
        this.setState({ signOutRedirect: true })
        this.auth.signOut()
        this.forceUpdate()
    };
  
    renderAuthButton = () => {
        if (this.state.isSignedIn === null) {
        return <div>error</div>;
        } else if (this.state.isSignedIn) {
            return (
            <div>
                <button onClick={this.handleSignOut}>Sign Out</button>
                {<Token token={this.auth.currentUser.get().getAuthResponse().id_token} />}
            </div>
            )
        } else {
            return <GoogleButton type='light' onClick={this.handleSignIn} />
        }
    }

    delete() {
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
                    this.props.ableToRedirect && this.state.isSignedIn && <Redirect to={{
                        pathname: '/',
                        state: { open: open, severity: severity, message: message, refresh: true }
                    }} />
                }
                {this.delete()}
                {this.redirect()}
            </div>
        )
    }
}
  
  export default GoogleAuth;