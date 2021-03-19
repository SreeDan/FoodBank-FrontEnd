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
            <ul> {/* List of all the options */}
                <li className="slide-drawer-name"><a href="/">Food Pantry Pickup</a></li>
                <li><a href="/companies">Food Banks</a></li>
                <li><a href="/filter">Filter</a></li>
                <li><a href="/location">Location Filtering</a></li>
                <li><a href="/bothfilter">Filter Location & Food</a></li>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/login"><ToolbarLogin /></a></li>
            </ul>
        </nav>
    );
};

export default sideDrawer;