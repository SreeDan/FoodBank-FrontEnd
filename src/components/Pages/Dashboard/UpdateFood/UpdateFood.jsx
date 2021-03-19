import React, { Component } from 'react';
import axios from 'axios';
import Select from "react-select";
import './UpdateFood.css';

class UpdateFood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            typeOptions: [
                { value: 'availablefood', label: 'Available Food' },
                { value: 'neededfood', label: 'Needed Food' }
            ],
            selectedOptions: [],
            foodOptions: []
        }
    }

    handleOptionsChange = (selectedOptions) => {
        this.setState({ selectedOptions })
    }

    sendUpdate = () => { //  Sends a PUT request to the back end which updates the food of the user
        const { selectedOptions, type } = this.state
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/company/food',
            data: {
                food: selectedOptions,
                type: type
            },
            withCredentials: true
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() { //  Gets all the food options that can be selected that are in the database
        axios({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/company/food',
            withCredentials: true
        })
            .then(response => {
                this.setState({ foodOptions: response.data })
            })
            .catch(error => {
                console.log(error)
            })
        axios({ //  Gets the available food for the account that will be edited
            method: 'GET',
            url: 'http://localhost:8080/api/v1/company/' + this.props.extension,
            withCredentials: true
        })
            .then(response => {
                this.setState({ selectedOptions: response.data[0]['food'] })
                console.log(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const { selectedOption, typeOptions, selectedOptions, foodOptions } = this.state
        return (
            <div className="update-food"> {/* Updates the food */}
                <Select
                    className="update-select"
                    isMulti
                    value={selectedOptions}
                    onChange={this.handleOptionsChange}
                    options={foodOptions}
                    placeholder={this.props.message}
                />
                <button className="update-send" onClick={this.sendUpdate}>Update</button>
            </div>
        )
    }

}

export default UpdateFood