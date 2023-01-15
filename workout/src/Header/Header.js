import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import ProfilePic from "../DEFAULT_PIC/profilePic.jpg";
import { Button, List, Menu, MenuItem } from "@material-ui/core";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import VideocamIcon from "@material-ui/icons/Videocam";
import ImageIcon from "@material-ui/icons/Image";
import DescriptionIcon from "@material-ui/icons/Description";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { FormatListBulletedOutlined, TramRounded } from "@material-ui/icons";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/lightGreen";
import orange from "@material-ui/core/colors/orange";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { getOneUser, logout } from "../actions/user";
import { getFile } from "../actions/post";
import Fade from "@material-ui/core/Fade";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open_menu: false,
      open_pop: false,
      anchorEl: null,
      leave: 0,
      user: null,
    };
    this.handleMenu = this.handleMenu.bind(this);
  }

  handleMenu = (open) => (event) => {
    if (open) {
      this.setState({ anchorEl: event.currentTarget });
    } else {
      this.setState({ anchorEl: null });
    }
    this.setState({
      open_menu: open,
    });
  };

  componentDidUpdate() {
    if (this.props.change === undefined) {
      return;
    }

    if (this.props.change !== this.state.user) {
      this.setState({ user: this.props.change });
    }
  }

  componentDidMount() {
    Promise.all([getOneUser(this, this.props.app.state.currentUser)]);
  }

  render() {
    return (
      <div className="header">
        <Link
          to={{
            pathname: "/homepage",
            state: {
              state: this.props.state,
            },
          }}
          className="link"
        >
          <span className="masthead-heading">WORKOUT</span>
        </Link>

        <div className="upload">
          <React.Fragment>
            <div style={{ position: "fixed", bottom: 20, right: 20 }}>
              <Fab
                className="menu_icon"
                color="primary"
                aria-label="add"
                onClick={this.handleMenu(true)}
              >
                <AddIcon />
              </Fab>
            </div>

            <Menu
              className="dropdown_menu"
              anchorEl={this.state.anchorEl}
              keepMounted
              open={this.state.open_menu}
              onClose={this.handleMenu(false)}
              TransitionComponent={Fade}
              PaperProps={{
                style: {
                  width: 300,
                },
              }}
            >
              <div
                className="top_menu"
                role="presentation"
                onClick={this.handleMenu(false)}
                onKeyDown={this.handleMenu(false)}
              >
                <Link to={"/uploadvideo"} className="link">
                  <MenuItem style={{fontSize:"1.3em"}}>
                    <ListItemIcon>
                      <VideocamIcon className="video_icon" />
                    </ListItemIcon>
                    Video Post
                  </MenuItem>
                </Link>
                <Link to={"uploadpicture"} className="link">
                  <MenuItem style={{fontSize:"1.3em"}}>
                    <ListItemIcon>
                      <ImageIcon className="image_icon" />
                    </ListItemIcon>
                    Picture Post
                  </MenuItem>
                </Link>
                <Link to={"/uploadblog"} className="link">
                  <MenuItem style={{fontSize:"1.3em"}}>
                    <ListItemIcon>
                      <DescriptionIcon className="blog_icon" />
                    </ListItemIcon>
                    Blog Post
                  </MenuItem>
                </Link>
              </div>
            </Menu>
          </React.Fragment>
        </div>

        <div className="profilePicContainer">
          <Link
            to={{
              pathname: "/profile",
              state: {
                state: this.props.state,
              },
            }}
          >
            <img
              src={
                this.state.user === null || this.state.user.profilePic === ""
                  ? ProfilePic
                  : getFile(this.state.user.profilePic)
              }
              className="profilePic"
            />
          </Link>
        </div>
        <div className="signout">
          <div className="link" onClick={() => logout(this.props.app)}>
            <h3 className="signout2">Log Out</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;