import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Requests.css'
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'
import ConfirmRequest from './ConfirmRequest';
import isEqual from 'lodash.isequal';

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
            status: '',
            userType: '',
            posts: []
        }
    }
    
    yesterday = Datetime.moment().subtract(1, 'day')
    onDateChange = (date) => {
        this.setState({ date })
    }

    setModal = (bool) => {
        this.setState({ modalIsOpen: bool })
    }

    test = (post) => {
        console.log(post)
        let message = ''
        this.setState({ message: message, requestId: post['requestId'], requesterName: post['requesterName'], receiverName: post['receiverName'], food: post['food'], date: post['date'], status: post['status'], modalIsOpen: true })
        console.log(this.state.requestId)
    }

    componentDidMount() {
        axios({
            method: 'post',
            url: 'http://localhost:8080/api/v1/company/request/get',
            data: [],
            withCredentials: true
        })
        .then(response => {
            this.setState({ posts: response.data, userType: response.data.userType })
            console.log(this.state.posts)
            console.log(response.data.userType)
        })
        .catch(error => {
            console.log(error)
        })
    }

    statusColor = (status) => {
        if (status == 'accepted') {
            return <td style={{ color: 'green' }}>{status}</td>
        }
        return <td style={{ color: '' }}>{status}</td>
    }

    name = (requesterName, receiverName) => {
        if (this.props.bank == 'bank') {
            return <td>{requesterName}</td>
        }
        return <td>{receiverName}</td>
    }

    renderTableData() {
        return this.state.posts.map((post, index) => {
            const { requesterName, receiverName, food, date, status } = post
            let name = ''
            return (
                <tr key={post.requestId} onClick={() => this.test(post)}>
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

    confirmRequest(requestId, date) {
        console.log(this.props.bank)
        let status = 'pending'
        if (this.props.bank == 'bank') {
            status = 'accepted'
        }
        console.log(date)
        axios({
            method: 'put',
            url: 'http://localhost:8080/api/v1/company/request',
            data: {
                status: status,
                date: date,
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

    valid = (current) => {
        return current.isAfter(this.yesterday)
    }

    handleDate = (date) => {
        this.setState({date: date._d})
        console.log(this.state.date)
     };

    modalHeader = (requesterName, receiverName) => {
        if (this.props.bank == 'bank') {
            return <header className="dashboard-modal-header">Request from {requesterName}</header>
        }
        return <header className="dashboard-modal-header">Request to {receiverName}</header>
    }

    modalIntroText = () => {
        if (this.props.bank == 'bank') {
            return <div>This user has requested this food from you:</div>
        }
        return <div>You have requested this food from this foodbank:</div>
    }

    render() {
        Modal.setAppElement('#root')
        const { modalIsOpen, requestId, message, requesterName, receiverName, food, date, status, posts } = this.state
        return (
            <div className="request-table">
                <h1 className="table-header">Your requests:</h1>
                <table className='requests'>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Food</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                        {this.renderTableData()}
                        {console.log(requestId)}
                    </tbody>
                </table>
                <Modal isOpen={modalIsOpen} onRequestClose={() => this.setModal(false)}>
                    {this.modalHeader(requesterName, receiverName)}
                    <hr />
                    <p>
                        {this.modalIntroText()} <br/>
                        <ul className="dashboard-modal-food">
                            {food.map((value, index) => {
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