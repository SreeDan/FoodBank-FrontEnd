import React, { Component } from 'react';
import axios from 'axios';
import isEqual from 'lodash.isequal';

class GToken extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: []
        }
    }
    token = ''

    Cookie() {
        if (isEqual(this.props.token, this.token) === false) {
            this.token = this.props.token
            axios({
                method: 'post',
                url: 'http://localhost:8080/api/v1/company/gauthenticate',
                data: {
                    token: this.props.token
                },
                withCredentials: true 
            })
            .then(response => {
                this.setState({ posts: response })
            })
            .catch(error => {
                console.log(error)
            })

        }
    }   

    render() {
        return (
            <div>
                {this.Cookie()}
            </div>
        )
    }
}

export default GToken