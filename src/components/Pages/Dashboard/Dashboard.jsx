import React, { Component } from 'react';
import axios from 'axios';
import Requests from './Requests';
import isEqual from 'lodash.isequal';
import './Dashboard.css'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import UpdateFood from "./UpdateFood/UpdateFood";

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
            editRedirect: false,
            showRequests: false,
            showAvailable: false,
            showNeeded: false,
            bank: false,
            message: '',
            posts: []
        }
    }
    
    name = (userType) => { //  Sets the title based on type of account
        if (userType == 'bank') {
            return <h1>Food Bank Dashboard</h1>
        }
        return <h1>User Dashboard</h1>
    }

    buttonRequestClick = () => { //  Sets the state s so that only one can be shown at a time
        const { showRequests } = this.state
        this.setState({ showRequests: !showRequests, showAvailable: false, showNeeded: false })
    }

    buttonAvailableFood = () => { //  Sets the states so that only one can be shown at a time
        const { showAvailable } = this.state
        this.setState({ showAvailable: !showAvailable, showRequests: false, showNeeded: false, message: 'Choose available food (You don\'t need to repeat options)' })
    }

    buttonNeededFood = () => { //  Sets the states so that only one can be shown at a time
        const { showNeeded } = this.state
        this.setState({ showNeeded: !showNeeded, showRequests: false, showAvailable: false, message: 'Choose needed food (You don\'t need to repeat options)' })
    }

    availableFoodButton = (userType) => { //  Shows this button if the user is a food bank
        if (userType === 'bank') {
            return <button onClick={this.buttonAvailableFood} className="dashboard-available-button">Edit Available Food</button>
        }
    }

    neededFoodButton = (userType) => { //  Shows this button if the user is a food bank
        if (userType === 'bank') {
            return <button onClick={this.buttonNeededFood} className="dashboard-available-button">Edit Needed Food</button>
        }
    }

    componentDidMount() { //  Gets the current information about the user and sees if the user is logged in
        const cookies = new Cookies()
        if (cookies.get('signedIn') == 'false' && cookies.get('gsignedIn') == 'false') {
            this.setState({ redirect: true })
        }
        axios({ //  Sends a GET request to the back end and stores the response data
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/dashboard',
            data: [],
            withCredentials: true
        })
        .then(response => {
            this.setState({ posts: JSON.parse(JSON.stringify(response.data)) })
        })
        .catch(error => {
            console.log(error)
        })
    }

    editButton = () => { //  Sets the editRedirect state to true which redirects the user to the edit page
        this.setState({ editRedirect: true })
    }

    requestButton = (userType) => { //  Changes the text of the button based on type of user
        if (userType == 'bank') {
            return <button onClick={this.buttonRequestClick} className="dashboard-request-button">Requests received</button>
        }
        return <button onClick={this.buttonRequestClick} className="dashboard-request-button">Requests sent</button>
    }

    showBox = (userType) => { //  Shows info for a food bank if the user is a food bank
        if (userType == 'bank') {
            return true;
        } return false;
    }
    
    render() {
        const { redirect, showRequests, showAvailable, showNeeded, editRedirect, bank, posts, message } = this.state

        if (redirect) return <Redirect to="/" />

        return (
            <div style={{ marginTop: '64px' }}>
                {
                    posts.length ?
                    posts.map(post => 
                    <div> 
                        <div className="dashboard-header">
                            {this.name(post.userType)}
                        </div>
                        <hr />
                        {this.showBox(post.userType) && <div className="dashboard-info"> {/* Shows information about the account only if the user a food bank */}
                            <img src={post.image} alt="pfp"/>
                            <ul>
                                <li>
                                    Website: {post.url}
                                </li>
                                <li>
                                    Phone: {post.phone}
                                </li>
                                <li className="dashboard-address-desktop">
                                    Address: {post.address.Street + ", " + post.address.City + ", " + post.address.State + " " + post.address.ZIP}
                                </li>
                            </ul>
                        </div>}
                        {this.showBox(post.userType) && <hr />} {/* Shows the line break only if the user is a food bank */}
                        <div className="dashboard-edit">
                            <button onClick={this.editButton} className="edit-button">Edit Profile</button>
                            {editRedirect && <Redirect to={{
                                pathname: '/dashboard/edit',
                                state: { userType: post.userType }
                            }}/>} {/* Redirects the user to the edit profile page */}
                        </div>
                        <div className="dashboard-requests">
                            <div className="button-block">
                                {this.requestButton(post.userType)} {/* Displays the button to show requests */}
                                {this.availableFoodButton(post.userType)} {/* Displays the button for editing available food only if the user is a food bank */}
                                {this.neededFoodButton(post.userType)} {/* Displays the button for editing needed food only if the user is a food bank */}
                            </div>
                            {showRequests && <Requests bank={post.userType} />} {/* Shows the requests */}
                            {showAvailable && <UpdateFood bank={post.userType} extension={"companyavailable"} message={message} type={"availablefood"} />} {/* Shows the bar to update food */}
                            {showNeeded && <UpdateFood bank={post.userType} extension={"companyneeded"} message={message} type={"neededfood"} />}
                        </div>
                    </div>) :
                    null
                }
            </div>
        )
    }
}

export default Dashboard