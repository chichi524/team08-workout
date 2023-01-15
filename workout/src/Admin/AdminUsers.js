import React from "react";
import "./Admin.css";

import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { Input } from "@material-ui/core";
import { Close, Delete, Refresh, Done } from "@material-ui/icons";
import Button from "@material-ui/core/Button";

import {
  patchUser,
  deleteUser,
  getAllUsers,
  adminUpdateUserInfo,
} from "../actions/user";

import { deletePost, changeLike } from "../actions/post";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editedIndex: -1,
      users: [],
      searchInput: "",
      filteredUsers: [],
    };
    this.editUser = this.editUser.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.close = this.close.bind(this);
  }

  handleSearchChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });

    const { users } = this.state;
    let filteredUsers = users.filter((user) => {
      return user.username.toLowerCase().includes(value);
    });

    this.setState({ filteredUsers });
  };

  handleDeleteUser(user) {
    const newUserBase = this.state.users.filter((u) => user !== u);

    
    user.posts.forEach((postId) => deletePost(postId));
    user.likedposts.forEach((likedPostId) => {
      if (!user.posts.includes(likedPostId)) {
        changeLike({ like: -1 }, likedPostId, this);
      }
    });
    
    deleteUser(user._id);

    this.setState({ editedIndex: -1, users: newUserBase });
  }

  close() {
    this.setState({ editedIndex: -1 });
  }

  editUser(index) {
    if (index === this.state.editedIndex) {
      patchUser(this);
      this.setState({ editedIndex: -1 });
    } else {
      this.setState({ editedIndex: index });
    }
  }

  async componentDidMount() {
    await getAllUsers(this);
    this.setState({ filteredUsers: this.state.users });
  }

  render() {
    return (
      <div className="adminContent">
        <h1>Users</h1>
        Below is an alphabetically sorted list of users that exist in the
        database.
        <div>
          <Input
            placeholder="Search username ..."
            id="searchInput"
            value={this.state.searchInput}
            style={{ float: "left" }}
            onChange={this.handleSearchChange}
          />{" "}
          <IconButton
            onClick={() => {
              getAllUsers(this);
            }}
            variant="contained"
            style={{ float: "right", fontSize: 20 }}
          >
            <Refresh color="primary" /> Refresh User List
          </IconButton>
        </div>
        <div align="center">
          <TableContainer
            className="userTable"
            component={Paper}
            align="center"
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> Username </TableCell>
                  <TableCell> Date Created </TableCell>
                  <TableCell> Number of Posts </TableCell>
                  <TableCell> User Type </TableCell>
                  <TableCell> Delete User </TableCell>
                  <TableCell> Change Password </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.filteredUsers
                  .sort(function (a, b) {
                    if (a.username.toUpperCase() < b.username.toUpperCase())
                      return -1;
                    else return 1;
                  })
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell padding="default" width="300">
                        {user.username}
                      </TableCell>
                      <TableCell>
                        {user.datecreated
                          ? user.datecreated.split("T")[0]
                          : null}
                      </TableCell>
                      <TableCell align="right">{user.posts.length}</TableCell>
                      <TableCell>
                        {user.username === "admin" ? "Admin" : "User"}
                      </TableCell>
                      <TableCell>
                        {user.username === "admin" ? null : (
                          <IconButton
                            onClick={() => this.handleDeleteUser(user)}
                          >
                            <Delete color="secondary" />
                          </IconButton>
                        )}
                      </TableCell>{" "}
                      <TableCell>
                        {user.username === "admin" ||
                        this.state.editedIndex === index ? null : (
                          <Button
                            variant="outlined"
                            onClick={() => this.editUser(index)}
                          >
                            Change Password
                          </Button>
                        )}
                        {this.state.editedIndex === index ? (
                          <div>
                            {" "}
                            <TextField
                              id="password"
                              onChange={(e) =>
                                adminUpdateUserInfo(this, user, e.target)
                              }
                            />{" "}
                            <IconButton onClick={() => this.editUser(index)}>
                              <Done color="primary" />
                            </IconButton>
                            <IconButton onClick={() => this.close()}>
                              <Close color="secondary" />
                            </IconButton>
                          </div>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }
}

export default Users;