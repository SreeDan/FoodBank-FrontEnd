import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Requests.css'
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'

class Requests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            message: '',
            requestId: 0,
            requesterName: '',
            receiverName: '',
            food: [],
            date: '',
            originalDate: '',
            original: false,
            status: '',
            userType: '',
            posts: []
        }
    }

    setModal = (bool) => { //  Changes whether the modal is open
        this.setState({ modalIsOpen: bool })
    }

    row = (post) => { //  Sets each row for the table
        let message = ''
        this.setState({ message: message, requestId: post['requestId'], requesterName: post['requesterName'], receiverName: post['receiverName'], food: post['food'], date: post['date'], originalDate: post['date'], status: post['status'], modalIsOpen: true })
    }

    componentDidMount() { //  Gets all requests
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/request/get',
            data: [],
            withCredentials: true
        })
        .then(response => {
            this.setState({ posts: response.data, userType: response.data.userType })
        })
        .catch(error => {
            console.log(error)
        })
    }

    statusColor = (status) => { //  Changes the color of the status depending on what it is
        if (status == 'accepted') {
            return <td style={{ color: 'green' }}>{status}</td>
        }
        return <td style={{ color: '' }}>{status}</td>
    }

    name = (requesterName, receiverName) => { //  Changes the name displaying in the request depending on who is viewing it
        if (this.props.bank == 'bank') {
            return <td>{requesterName}</td>
        }
        return <td>{receiverName}</td>
    }

    renderTableData() { //  Creates a table row
        return this.state.posts.map((post, index) => {
            const { requesterName, receiverName, food, date, status } = post
            let name = ''
            return (
                <tr key={post.requestId} onClick={() => this.row(post)}>
                    {this.name(requesterName, receiverName)}
                    <td>
                        {food.map((value, index) => {
                            return <li key={index} className="dashboard-table-food">{value}</li>
                        })}
                    </td>
                    <td>{date}</td>
                    {this.statusColor(status)}
                </tr>
            )
        })
    }

    confirmRequest(requestId, date) { //  Changes the status of the request and sends a request to the server
        if (this.state.date === this.state.originalDate) {
            this.setState({ original: true })
        }
        let status = 'pending'
        if (this.props.bank == 'bank') {
            status = 'accepted'
        }
        axios({
            method: 'put',
            url: 'http://localhost:8080/api/v1/company/request',
            data: {
                status: status,
                date: date,
                original: this.state.original,
                requestId: requestId
            }
        })
        .then(response => {
            this.componentDidMount()
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleDate = (date) => { //  Sets the date
        this.setState({date: date._d.toLocaleString()})
    };

    modalHeader = (requesterName, receiverName) => { //  Changes the text based on type of account
        if (this.props.bank == 'bank') {
            return <header className="dashboard-modal-header">Request from {requesterName}</header>
        }
        return <header className="dashboard-modal-header">Request to {receiverName}</header>
    }

    modalIntroText = () => {
        if (this.props.bank == 'bank') { //  Changes the text based on type of account
            return <div>This user has requested this food from you:</div>
        }
        return <div>You have requested this food from this food bank:</div>
    }

    render() {
        Modal.setAppElement('#root')
        const { modalIsOpen, requestId, message, requesterName, receiverName, food, date, status, posts } = this.state
        return (
            <div className="request-table">
                <h1 className="table-header">Your requests:</h1> {/* Table for a list of requests */}
                <table className='requests'>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Food</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
                <Modal isOpen={modalIsOpen} onRequestClose={() => this.setModal(false)}> {/* Opens the modal which is used for accepting and updating requests */}
                    {this.modalHeader(requesterName, receiverName)}
                    <hr />
                    <p>
                        {this.modalIntroText()} <br/>
                        <ul className="dashboard-modal-food">
                            {food.map((value, index) => { //  Show the food requested on the modal
                                return <li key={index}>{value}</li>
                            })}
                        </ul>
                    </p>
                    <div>
                        <Datetime onChange={this.handleDate} defaultValue={date} />
                    </div>
                    <div className="request-confirm-div">
                        <button onClick={() => this.confirmRequest(requestId, date)}>Confirm Request</button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Requests