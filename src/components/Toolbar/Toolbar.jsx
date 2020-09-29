import React, { Component } from 'react';
import DrawerToggle from '../SideDrawer/DrawerToggle';
import GoogleAuth from '../Auth/GoogleAuth';
import GoogleAuthToolbar from '../Auth/GoogleAuthToolbar';
import isEqual from 'lodash.isequal';
import Cookies from 'universal-cookie';
import './Toolbar.css';

class Toolbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: true,
            logout: false,
            glogout: false
        }
    }

    logout = () => {
        const cookies = new Cookies()
        cookies.set('signedIn', false)
        this.showElement()
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
            <div className="toolbar__logo"><a href="/">THE LOGO</a></div>
            <div className="spacer"></div>
            <div className="toolbar_navigation-items">

                <ul>
                    <li><a href="/companies">Food Banks</a></li>
                    <li><a href="/filter">Filter</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li>{this.showElement()}</li>
                </ul>
            </div>
        </nav>
    </header> 
        )
    }
}

export default Toolbar;