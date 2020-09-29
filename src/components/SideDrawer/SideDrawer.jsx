import React from 'react';
import './SideDrawer.css';
import GoogleAuth from '../Auth/GoogleAuth';

const sideDrawer = props => {
    let drawerClasses = 'side-drawer';
    if (props.show) {
        drawerClasses = 'side-drawer open';
    }
    return (
        <nav className={drawerClasses}>
            <ul>
                <li>
                    <a href="/companies">Food Banks</a>
                </li>
                <li>
                    <a href="/filter">Filter</a>
                </li>
                <li>
                    <a href="/login">Sign In</a>
                </li>
                <li className="side-drawer-google-button">
                    {<GoogleAuth />}
                </li>
            </ul>
        </nav>
    );
};

export default sideDrawer;