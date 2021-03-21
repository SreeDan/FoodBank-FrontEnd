import React, { Component } from 'react';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import { useHistory } from 'react-router'
import Slide from '@material-ui/core/Slide';
import Login from '../Login/Login'
import PhoneImage from '../../../Resources/FPPProcessPhone.PNG' 
import DesktopImage from '../../../Resources/FPPProcessDesktop-NoBorder.png'
import './Home.css'

class Home extends Component {
    constructor(props) {
        super(props)
        try {
            this.state = {
                open: this.props.location.state.open,
                severity: this.props.location.state.severity,
                message: this.props.location.state.message,
                refresh: this.props.location.state.refresh
            }
        } catch {}
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

    alert = () => {
        try {
            const history = useHistory()
            
            const { open, severity, message } = this.state
            console.log(severity)
            return (
                <div>
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={this.handleClose} TransitionComponent={this.Transition} autoHideDuration={6000}>
                        <Alert onClose={this.handleClose} severity={severity}>
                            {message}
                        </Alert>
                    </Snackbar>
                </div>
            )
        } catch { return <div />}
    }

    render() {
        return (
        <div>
            {this.alert()}
            
            <main style={{ marginTop: '64px' }}>
                <h1 className="steps">Simple Steps to Request Food</h1>
                <h1 className="phone-image"> {/* Displays the image which is displayed on a mobile screen */}
                    <img src={PhoneImage} alt="" height="475px" width="350px"/>
                </h1>
                <h1 className="desktop-image"> {/* Displays the image which is displayed on a computer screen */}
                    <img src={DesktopImage} alt="" height="475px" width="1200x"/>
                </h1>
                <h1 className="disclaimer">Please Allow this Website to Use Your Location for the Best User Experience</h1>
                <div className="home-login">
                    <Login />
                </div>
            </main>
        </div>
        )
    }
}

export default Home