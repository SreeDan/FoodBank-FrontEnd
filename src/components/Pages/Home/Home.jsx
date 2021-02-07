import React, { Component } from 'react';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import { useHistory } from 'react-router'
import Slide from '@material-ui/core/Slide';
import Cookies from 'universal-cookie';
import Login from '../Login/Login'
import PhoneImage from '../../../Resources/FPPProcessPhone.PNG' 
import DesktopImage from '../../../Resources/FPPProcessDesktop.png'
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
        const cookies = new Cookies()
        return (
        <div>
            {this.alert()}
            
            <main style={{ marginTop: '64px' }}>
            <h1 className="phone-image">
                <img src={PhoneImage} alt="" height="475px" width="350px"/>
            </h1>
            <h1 className="desktop-image">
                <img src={DesktopImage} alt="" height="500px" width="900"/>
            </h1>
            <div className="home-login">
                <Login />
            </div>
            </main>
        </div>
        )
    }
}

export default Home