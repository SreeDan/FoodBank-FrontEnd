import React, { Component } from 'react';
import axios from 'axios';
import './AllCompanies.css'
import GoogleAuth from '../../Auth/GoogleAuth';

class allCompanies extends Component {
    constructor(props) {
        super(props)
        this.state = {
        posts: []
        }
    }

    componentDidMount() {
    axios.get('http://localhost:8080/api/v1/company/')
    .then(response => {
        this.setState({posts: response.data})
    })
    .catch(error => {
        console.log(error)
    })
    }

    render() {
        const { posts } = this.state
        return (    
        <div className="all-companies">
            <GoogleAuth />
            <main style={{marginTop: '80px'}}>
            <div className="header">
                <h1>
                Food Banks
                </h1>
            </div>
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
                        <div className="phone">
                            {post.phone}
                        </div>
                        <div className="address">
                            {post.address.Street + ", " + post.address.City + ", " + post.address.State + " " + post.address.Zip}
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

export default allCompanies;