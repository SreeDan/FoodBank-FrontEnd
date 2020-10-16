import React, { Component } from 'react';
import axios from 'axios';
import Requests from './Requests';
import isEqual from 'lodash.isequal';
import './Dashboard.css'

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showRequests: false,
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

    buttonClick = () => {
        this.setState({ showRequests: true })
    }

    componentDidMount() {
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/dashboard',
            data: [],
            withCredentials: true
        })
        .then(response => {
            this.setState({ posts: JSON.parse(JSON.stringify(response.data)) })
            console.log(JSON.parse(response.data['userType']))
        })
        .catch(error => {
            console.log(error)
        })
    }

    requestButton = (userType) => {
        if (userType == 'bank') {
            return <button onClick={this.buttonClick} className="dashboard-request-button">Requests received</button>
        }
        return <button onClick={this.buttonClick} className="dashboard-request-button">Requests sent</button>
    }

    showBox = (userType) => {
        if (userType == 'bank') {
            return true;
        } return false;
    }
    
    render() {
        const { showRequests, bank, posts } = this.state
        console.log(this.showBox())
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
                                    Address: {post.address.Street + ", " + post.address.City + ", " + post.address.State + " " + post.address.Zip}
                                </li>
                            </ul>
                        </div>}
                        {this.showBox(post.userType) && <hr />}
                        <div className="dashboard-requests">
                            <div className="button-block">
                                {this.requestButton(post.userType)}
                            </div>
                            {console.log(post.userType)}
                            {showRequests && <Requests bank={post.userType} />}
                        </div>
                    </div>) :
                    null
                    
                }
            </div>
        )
    }
}

export default Dashboard