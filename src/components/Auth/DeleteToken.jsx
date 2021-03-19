import React, { Component } from 'react';
import axios from 'axios';

class DeleteToken extends Component {

    deleteToken() { //  Deletes the user's token
        axios({
            method: 'get',
            url: 'http://localhost:8080/api/v1/company/clear',
            data: [],
            withCredentials: true
        })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <div>
                {this.deleteToken}
            </div>
        )
    }
}

export default DeleteToken