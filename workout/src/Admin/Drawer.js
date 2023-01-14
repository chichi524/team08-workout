import "./Admin.css";
import React from "react";

import { Drawer, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";

import Users from "./AdminUsers";
import Dashboard from "./AdminDashboard";
import Posts from "./AdminPosts";

import { logout } from "../actions/user";

class AdminDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: "Dashboard",
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView(event) {
    const { innerText } = event.target;
    this.setState({
      currentView: innerText,
    });
  }

  render() {
    return (
      <div>
        <AppBar position="fixed" className="appbar">
          <Toolbar>
            <Typography variant="h5" noWrap className="appbarTitle">
              Admin View
            </Typography>
            <Typography style={{right: 0}} variant="h5" noWrap className="appbarTitle">
              {" "}
              <Button href="/" style={{color:"white", fontSize:"1em", right: 0}} onClick={() => logout(this.props.app)} component={Link}>
                Log Out
              </Button>
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" anchor="left">
          <List>
            {["Dashboard", "Users", "Posts"].map((text, index) => (
              <ListItem button key={text} id={text} onClick={this.changeView}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <div className="adminContentContainer">
          {this.state.currentView === "Users" ? <Users /> : null}
          {this.state.currentView === "Dashboard" ? <Dashboard /> : null}
          {this.state.currentView === "Posts" ? <Posts /> : null}
        </div>
      </div>
    );
  }
}

export default AdminDrawer;
