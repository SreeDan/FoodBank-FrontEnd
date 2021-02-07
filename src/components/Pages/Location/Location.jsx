import React, { Component } from "react";
import './Location.css'

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geolocation: false,
            able: false,
            lat: 0,
            lng: 0
        }

    }

    componentDidMount() {
        var component = this
        if ("geolocation" in navigator) {
            console.log("Available");
            navigator.geolocation.getCurrentPosition(function (position) {
                component.setState({ geolocation: true, able: true, lat: position.coords.latitude, lng: position.coords.longitude })
            })
            this.setState({ geolocation: false, able: true })
        } else {
            this.setState({ geolocation: false, able: false })
        }
    }

    displayAlert() {
        const { geolocation, able } = this.state
        if (!geolocation && able) {
            return (
            <div className="alert">
                Please Enable  Location Settings For This Website
            </div>
            )
        }
    }

    render() {
        return (
            <div style={{ marginTop: '64px' }}>
                {this.displayAlert()}
            </div>
        )
    }
}

export default Location;