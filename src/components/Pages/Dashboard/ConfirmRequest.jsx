import React, { Component } from 'react';
import axios from 'axios';

class ConfirmRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: []
        }
    }
    
    confirmRequest () { //  Sends a PUT request to the back end to accept the request
        axios({
            method: 'put',
            url: 'http://localhost:8080/api/v1/company/request',
            data: {
                status: 'accepted',
                date: this.props.date,
                requestId: this.props.requestId
            }
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
        })
        
    }
    
    render() {
        return (
            <div>
                {this.confirmRequest()}
            </div>
        )
    }
}

export default ConfirmRequest