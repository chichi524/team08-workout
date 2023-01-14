import * as React from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Input, IconButton, Button } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

import { deletePost, getAllPosts } from "../actions/post";

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      posts: [],
      searchInput: "",
      filteredPosts: [],
    };
    this.setSelection = this.setSelection.bind(this);
    this.deletePosts = this.deletePosts.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleSearchChange = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });

    const { posts } = this.state;
    let filteredPosts = posts.filter((post) => {
      return post.title.toLowerCase().includes(value);
    });

    this.setState({ filteredPosts });
  };

  // this should set the state to the selected rows.
  // then a button should be able to delete, etc.
  setSelection(item) {
    const newSelected = this.state.selected;
    const postId = item.data._id;

    if (newSelected.includes(postId)) {
      newSelected.splice(newSelected.indexOf(postId), 1);
    } else {
      newSelected.push(postId);
    }

    this.setState({ selected: newSelected });
  }

  async deletePosts() {
    let postsDeleted = this.state.posts.filter((post) => {
      return !this.state.selected.includes(post._id);
    });
    this.state.selected.forEach(function (postId) {
      deletePost(postId);
    });

    this.setState({ posts: postsDeleted, selected: [] });
  }

  async componentDidMount() {
    await getAllPosts(this);
    this.setState({ filteredPosts: this.state.posts });
  }

  render() {
    const columns = [
      { field: "title", headerName: "Title", flex: 3 },
      { field: "type", headerName: "Type", flex: 2 },
      { field: "likes", headerName: "Likes", type: "number", flex: 1 },
      {
        field: "comment_list",
        headerName: "Comments",
        flex: 1.5,
        type: "number",
        valueFormatter: (params) => params.value.length,
      },
      {
        field: "datecreated",
        headerName: "Date created",
        type: "date",
        flex: 2,
        valueFormatter: (params) =>
          params.value ? params.value.split("T")[0] : null,
      },
      {
        field: "filters",
        headerName: "Filters",
        flex: 4,
        valueFormatter: (params) => params.value.join(", "),
      },
      {
        field: "_id",
        headerName: "Go to Post",
        width: 200,
        renderCell: (params) => (
          <Button
            component={Link}
            variant="contained"
            style={{ width: 200 }}
            onClick={() => console.log(this.props)}
            to={{
              pathname: `/blogpost/${params.getValue("_id")}`,
              state: {
                post: params.row,
              },
            }}
          >
            Head to Post
          </Button>
        ),
      },
    ];
    return (
      <div className="adminContent">
        <h1>Post Manager</h1> Below are all the posts in the database <br />
        <div>
          <Input
            id="searchInput"
            value={this.state.searchInput}
            placeholder="Search posts ..."
            style={{ marginLeft: 15, float: "left" }}
            onChange={this.handleSearchChange}
          />
          <IconButton
            style={{ float: "right", fontSize: 20 }}
            onClick={this.deletePosts}
          >
            <Delete color="secondary" /> Delete Selected Posts
          </IconButton>
        </div>
        <br />
        <br />
        <br />
        <div style={{ height: 600 }}>
          <DataGrid
            rows={this.state.filteredPosts}
            getRowId={(row) => row._id}
            columns={columns}
            autoPageSize="true"
            checkboxSelection
            onRowSelected={(item) => this.setSelection(item)}
          />
        </div>
      </div>
    );
  }
}

export default Posts;
