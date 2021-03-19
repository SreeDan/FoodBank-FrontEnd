// This is used a lot to display food banks to the user
import React from "react";
import './AllCompanies/AllCompanies.css'

function display(posts, result, displayDistance) {
    return (
        <div className="company-block">
            <h2>
                {
                    posts.length ?
                        posts.map(post =>
                            <li>
                                <div key={post.id} className="company"> {/* Shows the food bank information */}
                                    <a href={"/user/" + post.id}> {/* Clicking on the food bank card will redirect a user to the food bank's page (IndivCompany) */}
                                        <div className="image">
                                            <img src={post.image} alt="" width="300" height="200" />
                                        </div>
                                        <div className="name">
                                            {post.name}
                                        </div>
                                        {displayDistance && <div className="distance">
                                            {post.distance + " Miles Away"}
                                        </div>}
                                        <div className="phone">
                                            {post.phone}
                                        </div>
                                        <div className="address">
                                            {post.address.Street + ", " + post.address.City + ", " + post.address.State + " " + post.address.ZIP}
                                        </div>
                                    </a>
                                </div>
                            </li>) :
                        null
                }
                <div className={result}>
                    Sorry, No FoodBanks Were Found With Those Filters :(
                </div>
            </h2>
        </div>
    )
}
export default display