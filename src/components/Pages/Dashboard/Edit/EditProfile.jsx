import React, { Component } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import isEqual from 'lodash.isequal';
import '../../Login/Login.css'
import {Redirect} from "react-router-dom";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            bank: false,
            billing: '',
            city : '',
            state: '',
            ZIP: '',
            email: '',
            user: '',
            pass: '',
            base64Image: '',
            imageName: '',
            imageMessage: 'Upload Profile Picture',
            URL: '',
            phone: '',
            open: false,
            severity: '',
            message: '',
        }
    }

    componentDidMount() {
        const cookies = new Cookies()
        if (cookies.get('signedIn') === 'false' && cookies.get('gsignedIn') === 'false') {
            this.setState({ redirect: true })
        }
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/dashboard',
            data: [],
            withCredentials: true
        })
            .then(response => {
                response = response.data[0]
                this.setState({
                    billing: response['address']['Street'],
                    city: response['address']['City'],
                    state: response['address']['State'],
                    ZIP: response['address']['ZIP'],
                    email: response['email'],
                    user: response['user'],
                    pass: response['pass'],
                    URL: response['url'],
                    phone: response['phone']
                })
                if (response['userType'] == 'bank') {
                    this.setState({ bank: true })
                }

                console.log(response)
                //console.log(JSON.parse(response.data['userType']))
            })
            .catch(error => {
                console.log(error)
            })
    }

    add(item, type) {
        switch (type) {
            case 'email':
                this.setState({ email: item.target.value })
                break;
            case 'user':
                this.setState({ user: item.target.value })
                break;
            case 'password':
                this.setState({ password: item.target.value })
                break;
            case 'billing':
                this.setState({ billing: item.target.value })
                break;
            case 'city':
                this.setState({ city: item.target.value })
                break;
            case 'state':
                this.setState({ state: item.target.value })
                break;
            case 'ZIP':
                this.setState({ ZIP: item.target.value })
                break;
            case 'URL':
                this.setState({ URL: item.target.value })
                break;
            case 'phone':
                this.setState({ phone: item.target.value })
                break;
        }
    }

    type = () => {
        const { open, severity, message } = this.state
        return (
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={this.handleClose} TransitionComponent={this.Transition} autoHideDuration={6000}>
                <Alert onClose={this.handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        )
    }

    handleUpdate = () => {
        const { billing, city, state, ZIP, email, user, pass, base64Image, URL, phone } = this.state
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/company/',
            data: {
                billing: billing,
                city: city,
                state: state,
                ZIP: ZIP,
                email: email,
                user: user,
                pass: pass,
                image: base64Image,
                url: URL,
                phone: phone
            },
            withCredentials: true
        })
            .then(response => {
                this.setState({ redirect: true })
                console.log(response)
            })
            .catch(error => {
                this.setState({ open: true, severity: 'error', message: error.response.data.message })
            })
    }


    imageChange = (e) => {
        let files = e.target.files
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        console.log(files[0].name)
        reader.onload = (e) => {
            this.setState({ base64Image: e.target.result, imageName: files[0].name, imageMessage: 'File Selected - ' + files[0].name })
            console.log("img data ", e.target.result)
        }
    }

    showLogin = () => {
        const cookies = new Cookies()
        const { user, pass } = this.state
        console.log(isEqual(cookies.get('signedIn'), true) === true)
        //if (isEqual(cookies.get('signedIn'), true) === true) {
        if (cookies.get('signedIn') == 'true') {
            return (
                <div>
                    <label htmlFor="fusername">Change Username</label>
                    <input type="text" id="fusername" name="username" placeholder="Username" defaultValue={user}
                           onChange={(item) => this.add(item, 'user')}/>
                    <label htmlFor="lpassword">Change Password</label>
                    <input type="password" id="lpassword" name="password" placeholder="Password" defaultValue={pass}
                           onChange={(item) => this.add(item, 'password')}/>
                </div>
            )
        }
    }

    render() {
        const { redirect, bank, billing, city, state, ZIP, email, user, pass, URL, phone, imageMessage } = this.state
        if (redirect) return <Redirect to="/" />
        return (
            <div style={{margin: '80px'}}>
                {this.type()}
                <div className="login-google-button">
                </div>
                <div className="form">
                    <label htmlFor="femail">Email</label>
                    <input type="email" id="femail" name="email" placeholder="Email" defaultValue={email}
                           onChange={(item) => this.add(item, 'email')}/>
                    {this.showLogin()}
                    <label htmlFor="laddress">Update Address</label>
                    <input type="billing" id="lbilling" name="billing" placeholder="Billing Address" defaultValue={billing}
                           onChange={(item) => this.add(item, 'billing')}/>
                    <input type="city" id="lcity" name="city" placeholder="City" defaultValue={city}
                           onChange={(item) => this.add(item, 'city')}/>
                    <input type="state" id="lstate" name="state" placeholder="State Abbreviation" defaultValue={state}
                           onChange={(item) => this.add(item, 'state')}/>
                    <input type="ZIP" id="lzip" name="zip" placeholder="Zip Code" defaultValue={ZIP}
                           onChange={(item) => this.add(item, 'ZIP')}/>
                    {bank && <div>
                        <label htmlFor="lurl">Update URL</label>
                        <input type="url" id="lurl" name="url" placeholder="URL" defaultValue={URL}
                               onChange={(item) => this.add(item, 'URL')}/>
                    </div>}
                    <label htmlFor="lphone">Update Phone</label>
                    <input type="phone" id="phone" name="phone" placeholder="phone" defaultValue={phone}
                           onChange={(item) => this.add(item, 'phone')}/>
                    {bank && <div className="file-upload">
                        <label htmlFor="file-input">
                            <label htmlFor="image-upload">{imageMessage} &emsp;</label>
                            <img src="https://icon-library.net/images/upload-photo-icon/upload-photo-icon-21.jpg" width={"50px"}/>
                        </label>
                        <input type="file" id="file-input" name="pfp" accept="image/png, image/jpeg, image/jpg" onChange={(event) => this.imageChange(event)}/>
                    </div>}
                           {/*<input type="submit" value="Login" onClick={this.handleSubmit} />*/}
                    <button onClick={this.handleUpdate} className="standard-create-button">Update Account</button>
                </div>
            </div>
        )
    }
}

export default EditProfile
