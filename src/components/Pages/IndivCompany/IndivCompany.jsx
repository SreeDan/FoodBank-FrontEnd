import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import isEqual from 'lodash.isequal';
import './IndivCompany.css';
import Cookies from 'universal-cookie';

class indivCompany extends Component {
	constructor(props) {
		super(props)
		this.state = {
			posts: [],
			selectedOptions: [],
			options: [],
			food: [],
			showSearch: false,
			showPost: false,
			open: false,
			severity: '',
			alertTitle: '',
			message: ''
		}
	}

	handleClick = () => { //  Opens the Alert
		this.setState({ open: true });
	};
	
	handleClose = () => { //  Closes the Alert
		this.setState({ open: false });
	};

	Transition(props) { //  Transition for the alert
		return <Slide direction="up" {...props} />;
	}

	type = () => { //  Displays the type of alert
		const { open } = this.state
		if (isEqual(this.state.severity, 'success') === true) {
			return (
				<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={this.handleClose} TransitionComponent={this.Transition} autoHideDuration={6000}>
					<Alert onClose={this.handleClose} severity={this.state.severity}>
						<AlertTitle>Success — your request has been sent!</AlertTitle>
						{this.state.message} <a href="/dashboard" className="alert-link"><strong>here</strong></a>
  					</Alert>
				</Snackbar>
			)
		} else {
			return (
				<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} onClose={this.handleClose} TransitionComponent={this.Transition} autoHideDuration={6000}>
					<Alert onClose={this.handleClose} severity={this.state.severity}>
						{this.state.message}
  					</Alert>
				</Snackbar>
			)
		}
	}

	onButtonClickHandler = () => { //  Displays the request component
		this.setState({ showSearch: true, showPost: true })
	}

	handleOptionsChange = (selectedOptions) => { //  Changes the selected options
		this.setState({ selectedOptions })
	}

	sendRequest(userId, food) { //  Sends the request to the database and checks to see if the user is logged in
		const cookies = new Cookies()
		if (isEqual(cookies.get('signedIn'), 'false') === true && isEqual(cookies.get('gsignedIn'), 'false') === true) {
			this.setState({ severity: 'error', message: 'Please log in to form a request' })
			this.handleClick()
			return
		}
		this.food = []
		if (isEqual(food, null) === false && food.length > 0) {
			for (let i = 0; i < food.length; i++) {
				this.food.push(food[i]['label'])
			}
			axios({ //  Request is sent and handles successes and errors
				method: 'post',
				url: 'http://localhost:8080/api/v1/company/request',
				data: {
					receiverId: userId,
					food: this.food,
					type: 'request',
					status: 'pending'
				},
				withCredentials: true
			})
			.then(response => {
				this.setState({ alertTitle: 'Success' })
				this.setState({ severity: 'success', message: 'View all your requests ' })
				this.handleClick()
			})
			.catch(error => {
				console.log(error)
				this.setState({ severity: 'error', message: 'Uh oh! — something went wrong' })
				this.handleClick()
			})
		} else {
			this.setState({ severity: 'info', message: 'Select a food' })
			this.handleClick()
		}
	}

	componentDidMount() { //  Gets the food banks information
		const { match: { params } } = this.props
		axios.get(`http://localhost:8080/api/v1/company/${params.userId}`)
			.then(response => {
				this.setState({ posts: response.data })
				if (response['data'][0]['availableFood']) {
					this.setState({options: response['data'][0]['availableFood']})
				}
			})
			.catch(error => {
				console.log(error)
			})
	}

	render() {
		const { posts, selectedOptions, options, showSearch, showPost } = this.state
		return (
			<div className="indiv-companies">
				<main style={{ marginTop: '80px' }}>
					<div className="indiv-header">
						<h1>  {/*color: #2e9abe;*/}
							{
								posts.length ?
									posts.map(post =>
										<div key={post.id} className="indiv-info"> {/* First half of the screen is the food banks information */}
											<div className="indiv-name">
												<h2>{post.name}</h2>
											</div>
											<ul className="indiv-contact">
												<li><a href={"http://" + post.url}>{post.url}</a></li>
												<li>{post.phone}</li>
												<li>{post.address.Street + ", " + post.address.City + ", " + post.address.State + " " + post.address.ZIP}</li>
											</ul>
										</div>) :
									null
							}
						</h1>
					</div>
					<hr />
					<div className="indiv-food">
						{this.type()}
						{
							posts.length ?
								posts.map(post =>
									<div className="indiv-request">
										<ul className="indiv-button-list">
											<li key={1}>
												<button onClick={this.onButtonClickHandler} className="request-button">Request</button>
											</li>
											<li key={2}>
												<button className="donate-button"><a neededFood={post.neededFood} href={"/user/" + post.id + "/donation"}>Donation List</a></button>
											</li>
										</ul>
										<div style={{ marginTop: '20px' }} className="indiv-post">

											<ul className="indiv-post-list">
												<li> {/* Shows the request component (Search bar and send button) */}
													{showSearch &&
														<Select
															isMulti
															blurInputOnSelect={false}
															defaultMenuIsOpen={true}
															closeMenuOnSelect={false}
															value={selectedOptions}
															onChange={this.handleOptionsChange}
															options={options}
															placeholder="Select..."
															className="indiv-search"
														/>
													}
												</li>
												<li>
													{
														showPost &&
														<button onClick={() => {this.sendRequest(post.id, selectedOptions)}} className="indiv-post-button">
															Send
														</button>
													}
												</li>
											</ul>
										</div>
									</div>
								) :
								null
						}
					</div>
				</main>
			</div>
		)
	}
}

export default indivCompany