import React, { Component } from 'react';
import DrawerToggle from '../SideDrawer/DrawerToggle';
import GoogleAuth from '../Auth/GoogleAuth';
import GoogleAuthToolbar from '../Auth/GoogleAuthToolbar';
import isEqual from 'lodash.isequal';
import Cookies from 'universal-cookie';
import './Toolbar.css';
import axios from 'axios';

class Toolbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: true,
            logout: false,
            glogout: false
        }
    }

    clearCookies = () => { //  Clears the cookies
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

    logout = () => { //  Logs the user out and calls clearCookies method
        const cookies = new Cookies()
        cookies.set('signedIn', false, {path: '/'})
        this.clearCookies()
        this.showElement()
        window.location.reload();
    }


    showElement = () => { //  Display login or logout
        const cookies = new Cookies()
        if (isEqual(cookies.get('signedIn'), 'true') == true) {
            return <button onClick={this.logout}>Sign Out</button>
        } else if (isEqual(cookies.get('gsignedIn'), 'true') == true) {
            return <GoogleAuthToolbar />
        }
        return <a href="/login">Sign In</a>
    }

    displayDashboard = () => { //  Display the dashboard option only if the user is logged in
        const cookies = new Cookies()
        if (isEqual(cookies.get('signedIn'), 'true') == true || isEqual(cookies.get('gsignedIn'), 'true') == true) {
            return <a href="/dashboard">Dashboard</a>
        }
    }

    componentDidUpdate() {
        this.showElement()
    }

    render() {
        return (
            <header className="toolbar">
            <nav className="toolbar__navigation">
            <div className = "toolbar__toggle-button">
                <DrawerToggle click={this.props.drawerClickHandler} />
            </div>
                <div className="toolbar__logo"><a href="/">Food Pantry Pickup</a></div>
                <div className="spacer"/>
                <div className="toolbar_navigation-items">
                <ul> {/* List of all the options */}
                    <li><a href="/companies">Food Banks</a></li>
                    <li><a href="/filter">Filter</a></li>
                    <li><a href="/location">Location Filtering</a></li>
                    <li><a href="/bothfilter">Filter Location & Food</a></li>
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