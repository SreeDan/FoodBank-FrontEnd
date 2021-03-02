import React, { Component } from "react";
import Select from "react-select";
import axios from "axios";
import './Location.css'
import '../AllCompanies/AllCompanies.css'

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            geolocation: false,
            able: false,
            lat: 0,
            lng: 0,
            stateSubmit: false,
            options: [
                { value: 'AL', label: 'AL' },
                { value: 'AK', label: 'AK' },
                { value: 'AZ', label: 'AZ' },
                { value: 'AR', label: 'AR' },
                { value: 'CA', label: 'CA' },
                { value: 'CO', label: 'CO' },
                { value: 'CT', label: 'CT' },
                { value: 'DE', label: 'DE' },
                { value: 'FL', label: 'FL' },
                { value: 'GA', label: 'GA' },
                { value: 'HI', label: 'HI' },
                { value: 'ID', label: 'ID' },
                { value: 'IL', label: 'IL' },
                { value: 'IN', label: 'IN' },
                { value: 'IA', label: 'IA' },
                { value: 'KS', label: 'KS' },
                { value: 'KY', label: 'KY' },
                { value: 'LA', label: 'LA' },
                { value: 'ME', label: 'ME' },
                { value: 'MD', label: 'MD' },
                { value: 'MA', label: 'MA' },
                { value: 'MI', label: 'MI' },
                { value: 'MN', label: 'MN' },
                { value: 'MS', label: 'MS' },
                { value: 'MO', label: 'MO' },
                { value: 'MT', label: 'MT' },
                { value: 'NE', label: 'NE' },
                { value: 'NV', label: 'NV' },
                { value: 'NH', label: 'NH' },
                { value: 'NJ', label: 'NJ' },
                { value: 'NM', label: 'NM' },
                { value: 'NY', label: 'NY' },
                { value: 'NC', label: 'NC' },
                { value: 'ND', label: 'ND' },
                { value: 'OH', label: 'OH' },
                { value: 'OK', label: 'OK' },
                { value: 'OR', label: 'OR' },
                { value: 'PA', label: 'PA' },
                { value: 'RI', label: 'RI' },
                { value: 'SC', label: 'SC' },
                { value: 'SD', label: 'SD' },
                { value: 'TN', label: 'TN' },
                { value: 'TX', label: 'TX' },
                { value: 'UT', label: 'UT' },
                { value: 'VT', label: 'VT' },
                { value: 'VA', label: 'VA' },
                { value: 'WA', label: 'WA' },
                { value: 'WV', label: 'WV' },
                { value: 'WI', label: 'WI' },
                { value: 'WY', label: 'WY' },
            ],
            selectedOption: [],
            posts: []
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

    handleOptionChange = (selectedOption) => {
        this.setState({ selectedOption })
    }

    displayAlert() {
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

    send(lat, lng, selectedOption) {
        console.log(lat)
        console.log(lng)
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
                console.log(response)
            })
            .catch(error => {
                console.log(error)
                console.log(lat)
                console.log(lng)
            })
    }

    displayState() {
        const {selectedOption, options} = this.state
        return (<Select
            value={selectedOption}
            onChange={this.handleOptionChange}
            options={options}
            isMulti={false}
            placeholder="Select type..."
        />)
    }

    render() {
        const{ posts } = this.state
        return (
            <div style={{ marginTop: '64px' }}>
                {this.displayAlert()}
                <main style={{marginTop: '80px'}}>
                    <hr />
                    <div className="company-block">
                        <h2>
                            {
                                posts.length ?
                                    posts.map(post =>
                                        <div key={post.id} className="company">
                                            <a href={"/user/" + post.id}>
                                                <div className="image">
                                                    <img src={post.image} alt="" width="300" height="200" />
                                                </div>
                                                <div className="name">
                                                    {post.name}
                                                </div>
                                                <div className="distance">
                                                    {post.distance + " Miles Away"}
                                                </div>
                                                <div className="phone">
                                                    {post.phone}
                                                </div>
                                                <div className="address">
                                                    {post.address.Street + ", " + post.address.City + ", " + post.address.State + " " + post.address.ZIP}
                                                </div>

                                            </a>
                                        </div>) :
                                    null
                            }
                        </h2>
                    </div>
                </main>
            </div>
        )
    }
}

export default Location;