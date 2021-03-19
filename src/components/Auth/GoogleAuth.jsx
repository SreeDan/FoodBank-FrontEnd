import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import Token from './GToken';
import GoogleButton from 'react-google-button';
import Cookies from 'universal-cookie';
import DeleteToken from './DeleteToken';
import axios from "axios";

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
            signOutRedirect: false,
            key: ''
        }
        try {
            this.props.ableToRedirect = this.state.ableToRedirect
            console.log(this.props.ableToRedirect)
            console.log(this.state.open)
        } catch (error)  {}
    }

    componentDidMount() {
        window.gapi.load('client:auth2', () => { //  Loads the client
            window.gapi.client
            .init({
                clientId: '892653406922-k0jle74fkvr92vs2ju7a2e7gi6h92738.apps.googleusercontent.com',
                scope: 'email',
            })
            .then(() => {
                this.auth = window.gapi.auth2.getAuthInstance()
                this.handleAuthChange()
                this.auth.isSignedIn.listen(this.handleAuthChange)
                
            });
        });
    }
  
    handleAuthChange = () => { //  Handle whether iSignedIn is true or false
        const cookies = new Cookies()
        cookies.set("gsignedIn", this.auth.isSignedIn.get(), {path: '/'})
        this.setState({ isSignedIn: this.auth.isSignedIn.get() });
        this.setState({ redirect: this.auth.isSignedIn.get() })
    };
  
    handleSignIn = () => { //  Sets the gsignedIn cookie to true and logs the user in
        const cookies = new Cookies()
        cookies.set('gsignedIn', true, {path: '/'})
        this.auth.signIn().then(() => {
            window.location.reload()
        })
        this.setState({ redirect: true, open: true, severity: 'success', message: 'You have been logged in!' })
    };
    
    redirect() { //  Redirects to the home page
        const { signOutRedirect } = this.state
        if (signOutRedirect) {
            this.setState({ signOutRedirect: false })
            return <Redirect to="/login" />
        }
    }

    handleSignOut = () => { //  Sets the gsignedIn cookie to false and sets states to true
        const cookies = new Cookies()
        cookies.set('gsignedIn', false, {path: '/'})
        this.setState({ signOutRedirect: true })
        this.auth.signOut()
        this.forceUpdate()
        return <DeleteToken/>
    };
  
    renderAuthButton = () => { //  Show the Sign in or Sign out button
        if (this.state.isSignedIn === null) {
        return <div></div>;
        } else if (this.state.isSignedIn) {
            return (
            <div>
                <button onClick={this.handleSignOut}>Sign Out</button>
                {<Token token={this.auth.currentUser.get().getAuthResponse().id_token} email={this.auth.currentUser.get().getBasicProfile().getEmail()} />}
            </div>
            )
        } else {
            return <GoogleButton type='light' onClick={this.handleSignIn} />
        }
    }

    render() {
        const { open, severity, message, deleteCookie } = this.state
        return (
            <div className="login-button">
                {this.renderAuthButton()}
                {   //  Redirects to the homepage
                    this.props.ableToRedirect && this.state.isSignedIn && <Redirect to={{
                        pathname: '/',
                        state: { open: open, severity: severity, message: message, refresh: true }
                    }} />
                }
                {this.redirect()}
            </div>
        )
    }
}
  
  export default GoogleAuth;