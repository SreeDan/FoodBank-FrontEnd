import React, { Component } from 'react';
import axios from 'axios';
import './FilterResults.css';
import isEqual from 'lodash.isequal';

class FilterResults extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: []
        }
    }

    type = "placeholder"
    food = [""]
    
    postData() {
        if (isEqual(this.props.type, this.type) === false || isEqual(this.props.food, this.food) === false) {
            this.type = ""
            this.food = []
            for (let i = 0; i < this.props.food.length; i++) {
                this.food.push(this.props.food[i])
            }
            this.type = this.props.type
            axios({
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
        const { posts } = this.state
        return (
        <div className="filter-all-companies">
            {this.postData()}
            <main>
            <div class="filter-company-block">
                <h1>
                {
                    posts.length ?
                    posts.map(post => 
                    <div key={post.id} className="filter-company">
                        <a href={"/user/" + post.id}>
                        <div className="filter-image">
                            <img src={post.image} alt="" width="300" height="200" />
                        </div>
                        <div className="filter-name">
                            {post.name}
                        </div>
                        <div className="filter-phone">
                            {post.phone}
                        </div>
                        <div className="filter-address">
                            {post.address.Street + ", " + post.address.City + ", " + post.address.State + " " + post.address.Zip}
                        </div>
                        </a>
                    </div>) :
                    null
                }
                </h1>
            </div>
            </main>
        </div>
        )
    }
}

export default FilterResults