import React, { Component } from 'react';
import axios from 'axios';
import Requests from './Requests';
import isEqual from 'lodash.isequal';
import './Dashboard.css'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import UpdateFood from "./UpdateFood";

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
            editRedirect: false,
            showRequests: false,
            showAvailable: false,
            bank: false,
            posts: []
        }
    }
    
    name = (userType) => {
        if (userType == 'bank') {
            return <h1>Foodbank Dashboard</h1>
        }
        return <h1>User Dashboard</h1>
    }

    buttonRequestClick = () => {
        const { showRequests, showAvailable } = this.state
        this.setState({ showRequests: !showRequests, showAvailable: false })
    }

    buttonAvailableFood = () => {
        const { showRequests, showAvailable } = this.state
        this.setState({ showAvailable: !showAvailable, showRequests: false })
    }

    componentDidMount() {
        const cookies = new Cookies()
        console.log(cookies.getAll())
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/dashboard',
            data: [],
            withCredentials: true
        })
        .then(response => {
            this.setState({ posts: JSON.parse(JSON.stringify(response.data)) })
            console.log(response)
            //console.log(JSON.parse(response.data['userType']))
        })
        .catch(error => {
            console.log(error)
        })
    }

    editButton = () => {
        this.setState({ editRedirect: true })
    }

    requestButton = (userType) => {
        if (userType == 'bank') {
            return <button onClick={this.buttonRequestClick} className="dashboard-request-button">Requests received</button>
        }
        return <button onClick={this.buttonRequestClick} className="dashboard-request-button">Requests sent</button>
    }

    availableFoodButton = (userType) => {
        if (userType === 'bank') {
            return <button onClick={this.buttonAvailableFood} className="dashboard-available-button">Edit Available Food</button>
        }
    }

    showBox = (userType) => {
        if (userType == 'bank') {
            return true;
        } return false;
    }
    
    render() {
        const { redirect, showRequests, showAvailable, editRedirect, bank, posts } = this.state

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
                        {this.showBox(post.userType) && <div className="dashboard-info">
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
                        {this.showBox(post.userType) && <hr />}
                        <div className="dashboard-edit">
                            <button onClick={this.editButton} className="edit-button">Edit Profile</button>
                            {editRedirect && <Redirect to={{
                                pathname: '/dashboard/edit',
                                state: { userType: post.userType }
                            }}/>}
                        </div>
                        <div className="dashboard-requests">
                            <div className="button-block">
                                {this.requestButton(post.userType)}
                                {this.availableFoodButton(post.userType)}
                            </div>
                            {console.log(post.userType)}
                            {showRequests && <Requests bank={post.userType} />}
                            {showAvailable && <UpdateFood bank={post.userType} />}
                        </div>
                    </div>) :
                    null
                    
                }
            </div>
        )
    }
}

export default Dashboard