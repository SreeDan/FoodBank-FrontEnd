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
            lat: 40.202575,
            lng: -75.34725,
            stateSubmit: false,
            options: states,
            selectedStateOption: [],
            posts: [],
            resultsClasses: 'zero-results',
            displayOptions: true
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

    handleStateChange = (selectedStateOption) => {
        this.setState({ selectedStateOption })
    }

    displayAlert() { //  Displays the select bar or the alert depending on the user's location setting
        const { displayOptions, geolocation, able, stateSubmit, selectedStateOption, options } = this.state
        if (!geolocation && able) {
            return (
                <div>
                    <div className="alert">
                        Please Enable Location Settings For This Website
                        <button onClick={() => this.sendDefaultLocation()} className="alert-button">Try with a Preset Default Location</button>
                    </div>
                </div>
            )
        } else if (!stateSubmit) {
            if (displayOptions) {
                return (
                    <div className="parent-state-search" style={{marginTop: '80px'}}>
                        <div className="state-search">
                            <Select
                                className="state-select"
                                value={selectedStateOption}
                                onChange={this.handleStateChange}
                                options={options}
                                placeholder="Choose a State..."
                            />
                        </div>
                        <button className="update-state" onClick={() => this.handleSubmit()}>Search</button>
                    </div>
                )
            } else {
                return <div></div>
            }
        }
    }

    sendDefaultLocation() {
        axios({ //  Sends the POST request to the back end and get the response of which food banks which meet the parameters
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/location',
            data: {
                lat: this.state.lat,
                lng: this.state.lng,
                state: 'PA',
                default: true
            }
        })
            .then(response => {
                this.setState({ posts: response.data, geolocation: true, resultsClasses: 'zero-results', displayOptions: false })
            })
            .catch(error => {
                if (error.response.data.message == 'None') {
                    this.setState({ resultsClasses: 'zero-results open' } )
                }
            })
    }

    handleSubmit() { //  Sends a POST request to the back end which returns a list of food banks
        const { lat, lng, selectedStateOption } = this.state
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/location',
            data: {
                lat: lat,
                lng: lng,
                state: selectedStateOption['value'],
                default: false
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