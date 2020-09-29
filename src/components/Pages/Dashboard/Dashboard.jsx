import React, { Component } from 'react';
import axios from 'axios';
import Requests from './Requests';
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

    render() {
        const { showRequests, bank, posts } = this.state
        return (
            <div style={{ marginTop: '64px' }}>
                {
                    posts.length ?
                    posts.map(post => 
                    <div> 
                        <div className="dashboard-header">
                            <h1>Dashboard</h1>
                        </div>
                        <hr />
                        <div className="dashboard-info">
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
                        </div>
                        <hr />
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