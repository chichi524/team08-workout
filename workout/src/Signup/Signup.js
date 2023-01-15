import React from 'react'
import './Signup.css'
import {Link} from 'react-router-dom'
import { Box, Button } from '@material-ui/core';

import { postUser } from '../actions/user';

class Signup extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            check_password: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.check = this.check.bind(this)
    }

    handleChange(event){
        const {id, value} = event.target
        this.setState({[id]: value})
    }

    check(){
        if (this.state.password !== this.state.check_password){
            alert("Your password do not match. Try again")
        }
        else if (this.state.password.length < 4){
            alert("Password must be at least 4 characters")
        }
        else{
            postUser(this)
        }
    }
    
    render() {
        return (
            <Box color="primary">
                <div className="container">
                    <div className="top"></div>
                    <div className="bottom"></div>
                    <div className="center">
                        <h2>Sign Up</h2>
                        <input required value = {this.state.username} onChange={this.handleChange} id="username" placeholder="username" />
                        <input required type="password" id="password" pattern=".{4,}" value = {this.state.password} onChange={this.handleChange} placeholder="password" />
                        <input required type="password" value = {this.state.check_password} onChange={this.handleChange} id="check_password" placeholder="confirm password" />
                        <br />

                        <Button onClick={this.check} color="primary" variant="contained">Register</Button>
                        <Link to="/" className="link">
                            <p>Go Back</p>
                        </Link>
                    </div>

                </div>
            </Box>
        )
    }
}

 export default Signup;
 