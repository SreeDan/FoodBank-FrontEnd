import React from 'react';
import { Component } from 'react';
import axios from 'axios';
import Cookies from 'cookie'
import { Redirect } from 'react-router-dom';


class Create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            redirect: false,
            user: '',
            password: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    add(item, type) {
        if (type == 'user') {
        this.setState({ user: item.target.value })
        } else {
            this.setState({ password: item.target.value })
        }
    }

    handleSubmit(event) {
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/create',
            data: {
                user: this.state.user,
                password: this.state.password
            },
            withCredentials: true
        })
        .then(response => {
            if (response.request.response == 'true') {
                this.setState({ posts: response, redirect: true })
            }
            console.log(response.request.response)
            console.log(this.state.redirect)
        })
        .catch(error => {
            console.log(error)
        })
        
    }

    render() {
        const { redirect } = this.state
        return (
            <div style={{margin: '80px'}}>
                {
                    redirect && <Redirect to={{
                        pathname: '/',
                    }}/>
                }
                <div className="login-google-button">
                </div>
                <div className="form">
                    <label for="fusername">Create Username</label>
                    <input type="text" id="fusername" name="username" placeholder="Username" onChange={(item) => this.add(item, 'user')} />
                    <label for="lpassword">Create Password</label>
                    <input type="password" id="lpassword" name="password" placeholder="Password" onChange={(item) => this.add(item, 'password')} />
                    {/*<input type="submit" value="Login" onClick={this.handleSubmit} />*/}
                    <button onClick={this.handleSubmit} className="standard-create-button">Create Account</button>
                </div>
            </div>
        )
    }
}

export default Create