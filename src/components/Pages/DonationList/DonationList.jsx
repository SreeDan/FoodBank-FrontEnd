import React from 'react';
import { Component } from 'react';
import axios from 'axios';
import './DonationList.css';

class DonationList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        const { match: { params } } = this.props
        axios.get(`http://localhost:8080/api/v1/company/${params.userId}/needed`)
        .then(response => {
            this.setState({ posts: response.data })
        })
        .catch(error => {
            console.log(error)
        })
    }
    
    render() {
        const { posts } = this.state
        return (
            <div>
                <main style={{marginTop: '80px'}}>
                    <h1 className="donation-header">
                        <h2>Our foodbank needs the following items</h2>
                    </h1>
                    <hr />
                    <div className="donation-food">
                        {
                            posts.length ?
                            posts.map(post =>
                                <ul className="donation-list">
                                    <li>
                                        {post.neededFood.map((value, index) => {
                                            return <li key={index}>{value}</li>
                                        })}
                                    </li>
                                </ul>
                            ) :
                            null
                        }
                    </div>
                </main>
            </div>
        )
    }
}

export default DonationList