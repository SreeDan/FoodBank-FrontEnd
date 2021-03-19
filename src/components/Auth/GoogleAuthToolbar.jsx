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
    _isMounted = false;
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
            key: '',
        }
        try {
            this.props.ableToRedirect = this.state.ableToRedirect
            console.log(this.props.ableToRedirect)
            console.log(this.state.open)
        } catch (error)  {}
    }

    componentDidMount() {
        this._isMounted = true;
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
        this.setState({ isSignedIn: this.auth.isSignedIn.get() });
        this.setState({ redirect: this.auth.isSignedIn.get() })
    };
  
    handleSignIn = () => { //  Sets the gsignedIn cookie to true and logs the user in
        const cookies = new Cookies()
        cookies.set('gsignedIn', true, {path: '/'})
        this.auth.signIn()
        this.setState({ redirect: true, open: true, severity: 'success', message: 'You have been logged in!' })
        window.location.reload();
    };

    handleSignOut = () => { //  Sets the gsignedIn cookie to false and sets states to true
        const cookies = new Cookies()
        cookies.set('gsignedIn', false, {path: '/'})
        this.setState({ deleteCookie: true })
        this.setState({ signOutRedirect: true })
        this.auth.signOut()
        window.location.reload(false);
        return <DeleteToken />
    };
  
    renderAuthButton = () => { //  Show the Sign in or Sign out button
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
            </div>
        )
    }
}
  
  export default GoogleAuthToolbar;