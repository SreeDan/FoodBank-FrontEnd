import React, { Component } from 'react';
import DrawerTo1ggle from '../SideDrawer/DrawerToggle';
import GoogleAuth from '../Auth/GoogleAuth';
import GoogleAuthToolbar from '../Auth/GoogleAuthToolbar';
import isEqual from 'lodash.isequal';
import Cookies from 'universal-cookie';

class ToolbarLogin extends Component {
    showElement = () => { //  Login for the toolbar
        const cookies = new Cookies()
        if (isEqual(cookies.get('signedIn'), 'true') == true) {
            return <button onClick={this.logout}>Sign Out</button>
        } else if (isEqual(cookies.get('gsignedIn'), 'true') == true) {
            return <GoogleAuthToolbar />
        }
        return <a href="/login">Sign In</a>
    }
    render() {
        return (
            <div>
                {this.showElement()}
            </div>
        )
    }
}

export default ToolbarLogin