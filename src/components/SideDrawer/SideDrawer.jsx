import React from 'react';
import './SideDrawer.css';
import GoogleAuth from '../Auth/GoogleAuth';
import ToolbarLogin from './ToolbarLogin';

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
                    <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                    <a href="/login"><ToolbarLogin /></a>
                </li>
                {/*<li className="side-drawer-google-button">
                    {<GoogleAuth />}
                </li>*/}
            </ul>
        </nav>
    );
};

export default sideDrawer;