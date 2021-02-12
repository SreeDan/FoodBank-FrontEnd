import React, { Component } from 'react';
import axios from 'axios';
import Select from "react-select";
import './UpdateFood.css';

class UpdateFood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: [],
            foodOptions: []
        }
    }

    handleOptionsChange = (selectedOptions) => {
        this.setState({ selectedOptions })
    }

    sendUpdate = () => {
        const { selectedOptions } = this.state
        axios({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/company/food',
            data: selectedOptions,
            withCredentials: true
        })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        console.log("ASD")
        //With credentials
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
        axios({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/company/companyavailable',
            withCredentials: true
        })
            .then(response => {
                this.setState({ selectedOptions: response.data[0]['availableFood'] })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const { selectedOptions, foodOptions } = this.state
        console.log("selectedOptions")
        console.log(selectedOptions)
        console.log("foodOptions")
        console.log(foodOptions)
        return (
            <div className="update-food">
                <Select
                    className="update-select"
                    isMulti
                    value={selectedOptions}
                    onChange={this.handleOptionsChange}
                    options={foodOptions}
                    placeholder="Choose food (You don't need to repeat options)"
                />
                <button className="update-send" onClick={this.sendUpdate}>Update</button>
            </div>
        )
    }

}

export default UpdateFood