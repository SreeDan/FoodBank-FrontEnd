import React, { Component } from 'react';
import DrawerToggle from '../SideDrawer/DrawerToggle';
import GoogleAuth from '../Auth/GoogleAuth';
import GoogleAuthToolbar from '../Auth/GoogleAuthToolbar';
import isEqual from 'lodash.isequal';
import Cookies from 'universal-cookie';
import './Toolbar.css';
import axios from 'axios';
import * as path from "path";

class Toolbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: true,
            logout: false,
            glogout: false
        }
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

    logout = () => {
        const cookies = new Cookies()
        cookies.set('signedIn', false, {path: '/'})
        console.log('logout')
        this.clearCookies()
        this.showElement()
        window.location.reload(false);
    }


    showElement = () => {
        const cookies = new Cookies()
        if (isEqual(cookies.get('signedIn'), 'true') == true) {

            return <button onClick={this.logout}>Logout</button>
        } else if (isEqual(cookies.get('gsignedIn'), 'true') == true) {
            console.log("checkpoint google")
            return <GoogleAuthToolbar />
        }
        return <a href="/login">Sign In</a>
    }

    displayDashboard = () => {
        const cookies = new Cookies()
        if (isEqual(cookies.get('signedIn'), 'true') == true || isEqual(cookies.get('gsignedIn'), 'true') == true) {
            return <a href="/dashboard">Dashboard</a>
        }
    }
    componentDidUpdate() {
        this.showElement()
    }

    render() {
        const cookies = new Cookies()
        const { login, logout, glogout } = this.state
        return (
            <header className="toolbar">

            <nav className="toolbar__navigation">
            <div className = "toolbar__toggle-button">
                <DrawerToggle click={this.props.drawerClickHandler} />
            </div>
            {/*<div className="toolbar__logo"><a href="/"><img src={this.encode} width="200" height="30" alt="a"></img></a></div>*/}
            <div className="toolbar__logo"><a href="/">Food Pantry Pickup</a></div>
            <div className="spacer"></div>
            <div className="toolbar_navigation-items">

                <ul>
                    <li><a href="/companies">Food Banks</a></li>
                    <li><a href="/filter">Filter</a></li>
                    <li><a href="/location">Location Filtering</a></li>
                    <li>{this.displayDashboard()}</li>
                    <li>{this.showElement()}</li>
                </ul>
            </div>
        </nav>
    </header> 
        )
    }
}

export default Toolbar;