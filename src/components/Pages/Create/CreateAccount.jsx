import React from 'react';
import { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import '../Login/Login.css'
import Select from 'react-select';
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

class Create extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            redirect: false,
            email: '',
            user: '',
            password: '',
            name: '',
            selectedOption: [],
            Options : [
                { value: 'bank', label: 'Food Bank' },
                { value: 'consumer', label: 'User' }
            ],
            billing: '',
            city : '',
            state: '',
            ZIP: '',
            open: false,
            severity: '',
            message: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    add(item, type) { //  Updates the values of the text fields in the form
        if (type == 'email') {
            this.setState({ email: item.target.value })
        } else if (type == 'user') {
            this.setState({ user: item.target.value })
        } else if (type == 'password'){
            this.setState({ password: item.target.value })
        } else if (type == 'name') {
            this.setState({ name: item.target.value })
        } else if (type == 'billing') {
            this.setState({ billing: item.target.value })
        } else if (type == 'city') {
            this.setState({ city: item.target.value })
        } else if (type == 'state') {
            this.setState({ state: item.target.value })
        } else if (type == 'ZIP') {
            this.setState({ ZIP: item.target.value })
        }
    }

    handleOptionChange = (selectedOption) => { //  Change the selected option for the user type
        this.setState({ selectedOption })
    }

    type = () => { //  Displays the alert that was the exception thrown on the back end
        const { open, severity, message } = this.state
        return (
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={this.handleClose} TransitionComponent={this.Transition} autoHideDuration={6000}>
                <Alert onClose={this.handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        )
    }

    handleSubmit(event) { //  Sends the POST request to the back end creating an account
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/create',
            data: {
                email: this.state.email,
                username: this.state.user,
                password: this.state.password,
                name: this.state.name,
                type: this.state.selectedOption['value'],
                billing: this.state.billing,
                city: this.state.city,
                state: this.state.state,
                ZIP: this.state.ZIP
            },
            withCredentials: true
        })
        .then(response => {
            if (response.request.response == 'true') { //  If the response is true, set the posts state to the response and redirect to the home page.
                this.setState({ posts: response, redirect: true })
            }
        })
            .catch((error) => { //  This error is the APIException thrown on the backend
                this.setState({ open: true, severity: 'error', message: error.response.data.message })
            })
        
    }

    render() {
        const { redirect, selectedOption, Options } = this.state
        return (
            <div style={{margin: '80px'}}>
                {
                    redirect && <Redirect to={{
                        pathname: '/',
                    }}/> //  Redirects to the home page if redirect is true
                }
                {this.type()}
                <div className="login-google-button">
                </div>
                <div className="form"> {/* Form for creating account */}
                    <label for="femail">Email</label>
                    <input type="email" id="femail" name="email" placeholder="Email" onChange={(item) => this.add(item, 'email')}/>
                    <label for="fusername">Create Username</label>
                    <input type="text" id="fusername" name="username" placeholder="Username" onChange={(item) => this.add(item, 'user')} />
                    <label for="lpassword">Create Password</label>
                    <input type="password" id="lpassword" name="password" placeholder="Password" onChange={(item) => this.add(item, 'password')} />
                    <label for="lname">Name</label>
                    <input type="name" id="lname" name="name" placeholder="Name" onChange={(item) => this.add(item, 'name')} />
                    <label for="lselect">Account Type</label>
                    <Select
                            value={selectedOption}
                            onChange={this.handleOptionChange} 
                            options={Options}
                            placeholder="Choose Account Type" 
                        />
                    <label for="laddress">Address</label>
                    <input type="billing" id="lbilling" name="billing" placeholder="Billing Address" onChange={(item) => this.add(item, 'billing')} />
                    <input type="city" id="lcity" name="city" placeholder="City" onChange={(item) => this.add(item, 'city')} />
                    <input type="state" id="lstate" name="state" placeholder="State Abbreviation" onChange={(item) => this.add(item, 'state')} />
                    <input type="ZIP" id="lzip" name="zip" placeholder="Zip Code" onChange={(item) => this.add(item, 'ZIP')} />
                    <button onClick={this.handleSubmit} className="standard-create-button">Create Account</button>
                </div>
            </div>
        )
    }
}

export default Create