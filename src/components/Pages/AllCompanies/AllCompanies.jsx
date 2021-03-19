import React, { Component } from 'react';
import axios from 'axios';
import './AllCompanies.css'
import GoogleAuth from '../../Auth/GoogleAuth';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css"
import display from "../displayCompanies";

class allCompanies extends Component {
    constructor(props) {
        super(props)
        this.state = {
        posts: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8080/api/v1/company/') //  Gets all food banks
        .then(response => {
            this.setState({  posts: response.data  })
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
    }

    render() {
        const { posts } = this.state
        return (
        <div className="all-companies">
            <GoogleAuth />
            <main style={{marginTop: '64px'}}>
            <div className="header">
                <h1>
                Food Banks
                </h1>
            </div>
            <hr />
                {display(posts, 'zero-results', false)}
            </main>
        </div>
        )
    }
}

export default allCompanies;