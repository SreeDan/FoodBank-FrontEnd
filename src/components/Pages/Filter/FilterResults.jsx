import React, { Component } from 'react';
import axios from 'axios';
import './FilterResults.css';
import isEqual from 'lodash.isequal';
import display from "../displayCompanies";

class FilterResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            zeroReturn: false,
            resultsClasses: 'zero-results'
        }
    }

    type = "placeholder"
    food = [""]
    
    postData() {
        if (isEqual(this.props.type, this.type) === false || isEqual(this.props.food, this.food) === false) { //  If the filtered food changed, then return a new result
            this.type = ""
            this.food = []
            for (let i = 0; i < this.props.food.length; i++) {
                this.food.push(this.props.food[i])
            }
            this.type = this.props.type
            axios({ //  Send the food options to the back end and get the response of which food banks have them
                method: 'post',
                url: 'http://localhost:8080/api/v1/company/filter',
                data: {
                    type: this.props.type,
                    availableFood: this.props.food,
                    neededFood: this.props.food
                }
            })
            .then(response => {
                this.setState({ posts: JSON.parse(response.request.response) })
                if (response.request.response.length === 2) { //  Determine what to do if their are no locations that match the filter
                    this.setState({ zeroReturn: true, resultsClasses: 'zero-results open' })
                } else {
                    this.setState({ zeroReturn: false, resultsClasses: 'zero-results' })
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    componentDidMount() {
        this.postData()
    }
    render() {
        const { posts, zeroReturn } = this.state
        return (
        <div className="filter-all-companies">
            {this.postData()}
            <main>
                {display(posts, this.state.resultsClasses, false)}
            </main>
        </div>
        )
    }
}

export default FilterResults