import React, { Component } from "react";
import Select from "react-select";
import axios from "axios";
import states from '../../../Resources/states'
import display from "../displayCompanies";
import './Location.css'

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geolocation: false,
            able: false,
            lat: 0,
            lng: 0,
            stateSubmit: false,
            options: states,
            selectedOption: [],
            posts: [],
            resultsClasses: 'zero-results'
        }

    }

    componentDidMount() { //  Checks if the user has allowed location in for the website
        var component = this
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                component.setState({ geolocation: true, able: true, lat: position.coords.latitude, lng: position.coords.longitude })
            })
            this.setState({ geolocation: false, able: true })
        } else {
            this.setState({ geolocation: false, able: false })
        }
    }

    handleOptionChange = (selectedOption) => {
        this.setState({ selectedOption })
    }

    displayAlert() { //  Displays the select bar or the alert depending on the user's location setting
        const { lat, lng, geolocation, able, stateSubmit, selectedOption, options } = this.state
        if (!geolocation && able) {
            return (
            <div className="alert">
                Please Enable Location Settings For This Website
            </div>
            )
        } else if (!stateSubmit) {
            return (
                <div className="parent-state-search">
                    <div className="state-search">
                        <Select
                            className="state-select"
                            value={selectedOption}
                            onChange={this.handleOptionChange}
                            options={options}
                            placeholder="Choose a State..."
                        />
                    </div>
                    <button className="update-state" onClick={() => this.send(lat, lng, selectedOption)}>Search</button>
                </div>
            )
        }
    }

    send(lat, lng, selectedOption) { //  Sends a POST request to the back end which returns a list of food banks
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/location',
            data: {
                lat: lat,
                lng: lng,
                state: selectedOption['value']
            }
        })
            .then(response => {
                this.setState({ posts: response.data })
                this.setState({ resultsClasses: 'zero-results' })
            })
            .catch(error => { //  If the exception thrown by the back end is 'None', there are no food banks in that location
                if (error.response.data.message == 'None') {
                    this.setState({ resultsClasses: 'zero-results open' })
                }
            })
    }

    render() {
        const{ posts } = this.state
        return (
            <div style={{ marginTop: '64px' }} className="all-companies">
                {this.displayAlert()}
                <main style={{marginTop: '80px'}}>
                    {display(posts, this.state.resultsClasses, true)}
                </main>
            </div>
        )
    }
}

export default Location;