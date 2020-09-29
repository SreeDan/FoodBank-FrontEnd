import React, { Component } from 'react';
import axios from 'axios';

class DeleteToken extends Component {

    deleteToken() {
        axios.get('http://localhost:8080/api/v1/company/gauthenticate')
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