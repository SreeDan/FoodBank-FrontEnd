import React from 'react';
import { Component } from 'react';
import axios from 'axios';
import Cookies from 'cookie'
import { Redirect } from 'react-router-dom';
import '../Login/Login.css'
import Select from 'react-select';

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
                { value: 'bank', label: 'FoodBank' },
                { value: 'consumer', label: 'User' }
            ],
            billing: '',
            city : '',
            state: '',
            ZIP: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    add(item, type) {
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
            this.setState({ ZIP: this.target.value })
        }
    }

    handleOptionChange = (selectedOption) => {
        this.setState({ selectedOption })
    }

    handleSubmit(event) {
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
        const { redirect, selectedOption, Options } = this.state
        console.log(selectedOption)
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
                    <label for="femail">Email</label>
                    <input type="email" id="femail" name="email" placeholder="Email" onChange={(item) => this.add(item, 'email')}></input>
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
                    <input type="billing" id="lbilling" name="billing" placeholder="Billing Address (Optional)" onChange={(item) => this.add(item, 'billing')} />
                    <input type="city" id="lcity" name="city" placeholder="City (Optional)" onChange={(item) => this.add(item, 'city')} />
                    <input type="state" id="lstate" name="state" placeholder="State Abbreviation (Optional)" onChange={(item) => this.add(item, 'state')} />
                    <input type="ZIP" id="lzip" name="zip" placeholder="Zip Code (Optional)" onChange={(item) => this.add(item, 'ZIP')} />
                    {/*<input type="submit" value="Login" onClick={this.handleSubmit} />*/}
                    <button onClick={this.handleSubmit} className="standard-create-button">Create Account</button>
                </div>
            </div>
        )
    }
}

export default Create