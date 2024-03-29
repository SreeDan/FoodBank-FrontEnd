import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import FilterResults from './FilterResults';
import './Filter.css';

class Filter extends Component {
    state = {
        selectedOptions: [],
        foodOptions: [],
        selectedOption: [],
        typeOptions: [
            { value: 'availableFood', label: 'Available Food' },
            { value: 'neededFood', label: 'Needed Food' },
            { value: 'both', label: 'Both' }
        ],
        food: [],
        type: ""
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

    componentDidMount() { //  Get all the food which could be used in the filter.
        axios.get('http://localhost:8080/api/v1/company/food')
            .then(response => {
                this.setState({  foodOptions: response.data  })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const { selectedOptions, foodOptions, selectedOption, typeOptions, food, type } = this.state
        {
            this.state.food = []
            if (selectedOptions != null) {
                for(let i = 0; i < selectedOptions.length; i++ ) { //  Updating the food state with the selected options
                    food.push(selectedOptions[i]['label'])
                }
            }
        }
        return (
            <React.Fragment>
            <div>
                <main style={{marginTop: '64px'}}>
                    <div className="type-search"> {/* Choose what type of food to filter by */}
                        <Select
                            value={selectedOption}
                            onChange={this.handleOptionChange} 
                            options={typeOptions}
                            placeholder="Select type..." 
                        />
                    </div>
                    <div className="search">  {/* Choose what food to filter */}
                        <Select
                            isMulti
                            value={selectedOptions}
                            onChange={this.handleOptionsChange}
                            options={foodOptions}
                            placeholder="Search for food..." 
                        />
                    </div>
                    <div className="filter-instructions">
                        <p>Choose type then food</p>
                    </div>
                    <div className="filter-results">
                        <FilterResults type={type} food={food} /> {/* Returns the filtered results */}
                    </div>
                </main>
            </div>
            </React.Fragment>
        )
    }
}

export default Filter