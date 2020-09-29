import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Toolbar from './components/Toolbar/Toolbar';
import SideDrawer from './components/SideDrawer/SideDrawer';
import Backdrop from './components/Backdrop/Backdrop';
import Home from './components/Pages/Home/Home';
import AllCompanies from './components/Pages/AllCompanies/AllCompanies';
import IndivCompany from './components/Pages/IndivCompany/IndivCompany';
import Filter from './components/Pages/Filter/Filter';
import DonationList from './components/Pages/DonationList/DonationList';
import Login from './components/Pages/Login/Login';
import Dashboard from './components/Pages/Dashboard/Dashboard';

class App extends Component {
    state = {
        sideDrawerOpen: false
    };
    
    drawerToggleClickHandler = () => {
        this.setState((prevState) => {
        return {sideDrawerOpen: !prevState.sideDrawerOpen};
        });
    };

    backdropClickHandler = () => {
        this.setState({sideDrawerOpen: false})
    };

    render() {
        let backdrop;
        
        if (this.state.sideDrawerOpen) {
        backdrop = <Backdrop click={this.backdropClickHandler} />;
        }
        return (
        <Router>
        <div style={{height: '100%'}}>
            <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
            <SideDrawer show={this.state.sideDrawerOpen} />
            {backdrop}
            
            <Route path={"/"} exact component={Home} />
            <Route path={"/companies"} exact thing={'asd'} component={AllCompanies} />
            <Route path={"/user/:userId"} exact component={IndivCompany} />
            <Route path={"/user/:userId/donation"} exact component={DonationList} />
            <Route path={"/filter"} exact component={Filter} />
            <Route path={"/login"} exact component={Login} />
            <Route path={"/dashboard"} exact component={Dashboard} />
        </div>
        </Router>
        );
    }
}

export default App;
