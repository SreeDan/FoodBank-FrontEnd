import React, { Component } from "react";
import Select from "react-select";
import axios from "axios";
import states from "../../../Resources/states";
import './BothFilter.css'
import '../AllCompanies/AllCompanies.css'
import display from "../displayCompanies";

class BothFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            selectedOptions: [],
            foodOptions: [],
            typeOptions: [
                { value: 'availableFood', label: 'Available Food' },
                { value: 'neededFood', label: 'Needed Food' },
                { value: 'both', label: 'Both' }
            ],
            food: [],
            type: "",
            geolocation: false,
            able: false,
            lat: 40.202575,
            lng: -75.34725,
            stateSubmit: false,
            stateOptions: states,
            selectedStateOption: [],
            resultsClasses: 'zero-results',
            displayOptions: true
        }
    }

    handleStateChange = (selectedStateOption) => {
        this.setState({ selectedStateOption })
    }

    handleOptionChange = (selectedOption) => { //  Change the selected option for the food type
        this.setState({ selectedOption })
        try {

            this.state.type = selectedOption['value']
        } catch (e) {}
    }

    handleOptionsChange = (selectedOptions) => { //  Change the selected options for the food
        this.setState({ selectedOptions })
    }

    componentDidMount() { //  Checks if the user has allowed location in for the website and gets all the food which could be used in the filter.
        var component = this
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                component.setState({ geolocation: true, able: true, lat: position.coords.latitude, lng: position.coords.longitude })
            })
            this.setState({ geolocation: false, able: true })
        } else {
            this.setState({ geolocation: false, able: false })
        }
        axios.get('http://localhost:8080/api/v1/company/food')
            .then(response => {
                this.setState({  foodOptions: response.data  })
            })
            .catch(error => {
                console.log(error)
            })
    }

    displayAlert() { //  Displays the select bar or the alert depending on the user's location setting
        const { displayOptions, geolocation, able, stateSubmit, selectedStateOption, stateOptions } = this.state
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
                    <div className="both-parent-state-search" style={{marginTop: '115px'}}>
                        <div className="both-state-search">
                            <Select
                                className="state-select"
                                value={selectedStateOption}
                                onChange={this.handleStateChange}
                                options={stateOptions}
                                placeholder="Choose a State..."
                            />
                        </div>
                        <button className="both-update-state" onClick={() => this.handleSubmit()}>Search</button>
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
            url: 'http://localhost:8080/api/v1/company/bothfilter',
            data: {
                type: this.state.type,
                availableFood: this.state.food,
                neededFood: this.state.food,
                lat: this.state.lat,
                lng: this.state.lng,
                state: this.state.selectedStateOption['value'],
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

    handleSubmit() {
        const{ food, selectedOptions } = this.state
        this.setState({ food: [] })
        if (selectedOptions != null) {
            for(let i = 0; i < selectedOptions.length; i++ ) { //  Updating the food state with the selected options
                food.push(selectedOptions[i]['label'])
            }
        }
        axios({ //  Sends the POST request to the back end and get the response of which food banks which meet the parameters
           method: 'post',
           url: 'http://localhost:8080/api/v1/company/bothfilter',
           data: {
               type: this.state.type,
               availableFood: this.state.food,
               neededFood: this.state.food,
               lat: this.state.lat,
               lng: this.state.lng,
               state: this.state.selectedStateOption['value'],
               default: false
           }
        })
            .then(response => {
                this.setState({ posts: response.data })
                this.setState({ resultsClasses: 'zero-results' })
            })
            .catch(error => {
                if (error.response.data.message == 'None') {
                    this.setState({ resultsClasses: 'zero-results open' } )
                }
            })
    }

    render() {
        const { displayOptions, selectedOption, typeOptions, foodOptions, selectedOptions, posts } = this.state
        return (
            <div>
                <main style={{marginTop: '64px'}}>
                    {this.displayAlert()}
                    {displayOptions && <div className="type-search"> {/* Choose what type of food to filter by */}
                        <Select
                            value={selectedOption}
                            onChange={this.handleOptionChange}
                            options={typeOptions}
                            placeholder="Select type..."
                        />
                    </div>}
                    {displayOptions && <div className="search">  {/* Choose what food to filter */}
                        <Select
                            isMulti
                            value={selectedOptions}
                            onChange={this.handleOptionsChange}
                            options={foodOptions}
                            placeholder="Search for food..."
                        />
                    </div>}
                    {displayOptions && <div className="filter-instructions">
                        <p>Choose type, food, pick a state, and search</p>
                    </div>}
                    {!displayOptions && <div className="filter-instructions" style={{marginTop: '10px'}}>If you allow this app to access location, reload the page</div>}
                    <div className="both-filter-company" style={{marginTop: '60px'}}>
                        <main>
                            {display(posts, this.state.resultsClasses, true)}
                        </main>
                    </div>
                </main>
            </div>
        );
    }
}

export default BothFilter