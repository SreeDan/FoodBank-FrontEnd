import React, { Component } from 'react';
import axios from 'axios';
import isEqual from 'lodash.isequal';
import {Redirect} from "react-router-dom";
import {red} from "@material-ui/core/colors";

class GToken extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            redirectSetup: false
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
                    token: this.props.token,
                    email: this.props.email
                },
                withCredentials: true 
            })
            .then(response => {
                this.setState({ posts: response })
            })
            .catch(error => {
                try {
                    if (error.response.data.message === "No Account") {
                        this.setState({redirectSetup: true})
                    }
                    console.log(error.response.data.message === "No Account")
                } catch (error) {}
            })

        }
    }   

    render() {
        const{ redirectSetup } = this.state
        return (
            <div>
                {this.Cookie()}
                {
                    redirectSetup && <Redirect to={{
                        pathname: "/setup",
                        state: { open: true, token: this.props.token, email: this.props.email }
                    }}/>
                }
            </div>
        )
    }
}

export default GToken