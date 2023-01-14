import React from 'react'
import {Link} from 'react-router-dom'
import { Box, Button } from '@material-ui/core';
import './Login.css'
import { login } from "./actions/user";



class Login extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handlePress = this.handlePress.bind(this)
    }

    handleChange(event){
        const {id, value} = event.target
        this.setState({[id]: value})
    }

    handlePress(event){
        if(event.which == 13){
            login(this, this.props.app);
        }
    }


    render() {
        return (
            <Box color="primary">
                <div className="container">
                    <div className="top"></div>
                    <div className="bottom"></div>
                    <div className="center">
                        <h2>Welcome to WORKOUT</h2>
                        <input value = {this.state.username} onChange={this.handleChange} id="username" placeholder="username" onKeyPress={this.handlePress}/>
                        <input type="password" value = {this.state.password} onChange={this.handleChange} id="password" 
                        placeholder="password" onKeyPress={this.handlePress}/>
                        <Button color="primary" variant="contained" onClick={()=>login(this, this.props.app)}>Login</Button>
                        <Link to="/signup" className="link">
                            <p>Don't have an account?</p>
                        </Link>
                    </div>

                </div>
            </Box>
        )
    }
}

 export default Login;