import React, { Component } from 'react';
import DrawerToggle from '../SideDrawer/DrawerToggle';
import GoogleAuth from '../Auth/GoogleAuth';
import GoogleAuthToolbar from '../Auth/GoogleAuthToolbar';
import isEqual from 'lodash.isequal';
import Cookies from 'universal-cookie';

class ToolbarLogin extends Component {
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
    render() {
        return (
            <div>
                {this.showElement()}
            </div>
        )
    }
}

export default ToolbarLogin