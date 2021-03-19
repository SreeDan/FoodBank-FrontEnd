import React, {Component} from "react";
import axios from 'axios';
import {Redirect} from "react-router-dom";
import Select from "react-select";
import '../Login/Login.css';
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import Cookies from "universal-cookie";

class Setup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            email: '',
            redirectHome: false,
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
        if (type == 'name') {
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

    componentDidMount() { //  Sees if this page is supposed to load
        const cookies = new Cookies()
        if (cookies.get('gsignedIn') == 'false') {
            this.setState({ redirectHome: true })
        }
        try {
            this.setState({ token: this.props.location.state.token, email: this.props.location.state.email })
        } catch (error) {
            this.setState({ redirectHome: true })
        }
    }

    handleSubmit() { //  Sends the POST request to the back end that sets up the account
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/gaccount',
            data: {
                token: this.state.token,
                email: this.state.email,
                name: this.state.name,
                type: this.state.selectedOption['value'],
                billing: this.state.billing,
                city: this.state.city,
                state: this.state.state,
                ZIP: this.state.ZIP
            }
        })
            .then(response => {
                this.setState({ redirectHome: true })
            })
            .catch(error => {
                this.setState({ open: true, severity: 'error', message: error.response.data.message })
            })
    }

    render() {
        const { redirectHome, selectedOption, Options } = this.state
        return (
            <div style={{margin: '80px'}}>
                {
                    redirectHome && <Redirect to="/" /> //  Redirect to the homepage
                }
                <h1 className="header-setup">Setup Your Account</h1>
                <div className="form"> {/* Form for setting up an account */}
                    <label htmlFor="lname">Name</label>
                    <input type="name" id="lname" name="name" placeholder="Name"
                           onChange={(item) => this.add(item, 'name')}/>
                    <label htmlFor="lselect">Account Type</label>
                    <Select
                        value={selectedOption}
                        onChange={this.handleOptionChange}
                        options={Options}
                        placeholder="Choose Account Type"
                    />
                    <label htmlFor="laddress">Address</label>
                    <input type="billing" id="lbilling" name="billing" placeholder="Billing Address"
                           onChange={(item) => this.add(item, 'billing')}/>
                    <input type="city" id="lcity" name="city" placeholder="City"
                           onChange={(item) => this.add(item, 'city')}/>
                    <input type="state" id="lstate" name="state" placeholder="State Abbreviation"
                           onChange={(item) => this.add(item, 'state')}/>
                    <input type="ZIP" id="lzip" name="zip" placeholder="Zip Code"
                           onChange={(item) => this.add(item, 'ZIP')}/>
                    <button onClick={this.handleSubmit} className="standard-create-button">Create Account</button>
                </div>
            </div>
        )
    }
}

export default Setup