// environment configutations
import ENV from "./../config.js";
const API_HOST = ENV.api_host;

export const adminUpdateUserInfo = (formComp, user, field) => {
  const value = field.value;
  const id = field.id;

  formComp.setState((prevState) => ({
    users: prevState.users.map((u) => (u === user ? { ...u, [id]: value } : u)),
  }));
};

// A function to send a GET request to get all of the users information
export const getAllUsers = async (userList) => {
  const url = `${API_HOST}/api/users`;

  await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get users");
      }
    })
    .then((json) => {
      userList.setState({ users: json });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const postUser = (app) => {
  console.log(app.state)

  const request = new Request(`${API_HOST}/api/users`, {
    method: "post",
    body: JSON.stringify(app.state),
    headers: {
      "Content-Type": "application/json",
    },
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        alert("Registration successful");
        let homepage_url = window.location.origin + "/";
        window.location.assign(homepage_url);
      } else {
        alert("Error during signup, username taken");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Delete a user
export const deleteUser = async (userID) => {
  const request = new Request(`${API_HOST}/api/users/${userID}`, {
    method: "delete",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not delete user");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// A function to send a PATCH request to update user information
export const patchUser = (admin) => {
  console.log(JSON.stringify(admin.state.users[admin.state.editedIndex]));

  const request = new Request(
    `${API_HOST}/api/users/${admin.state.users[admin.state.editedIndex]._id}`,
    {
      method: "put",
      body: JSON.stringify(admin.state.users[admin.state.editedIndex]),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );


  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not patch users");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const allPostFromUser = async (userID, postList) => {
  const url = `${API_HOST}/api/users/posts/${userID}`;

  await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get user's posts");
      }
    })
    .then((json) => {
      postList.setState({ posts: json.posts, user: json.user, bio: json.bio });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Send a request to check if a user is logged in through the session cookie
export const checkSession = (app) => {
  const url = `${API_HOST}/users/check-session`;

  if (!ENV.use_frontend_test_user){
    fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((json) => {
      if (json && json.currentUser) {
        app.setState({ currentUser: json.currentUser });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  } else{
    app.setState({currentUser: ENV.user})
  }

};

// A function to send a POST request with the user to be logged in
export const login = (loginComp, app) => {
  // Create our request constructor with all the parameters we need
  const request = new Request(`${API_HOST}/users/login`, {
    method: "post",
    body: JSON.stringify(loginComp.state),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Send the request with fetch()
  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Incorrect username or password");
      }
    })
    .then((json) => {
      if (json === undefined) {
        return;
      }
      if (json.currentUser !== undefined) {
        app.setState({ currentUser: json.currentUser });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a GET request to logout the current user
export const logout = (app) => {
  const url = `${API_HOST}/users/logout`;

  fetch(url)
    .then((res) => {
      app.setState({
        currentUser: null,
      });
      let homepage_url = window.location.origin + '/';
      window.location.assign(homepage_url);
    })
    .catch((error) => {
      console.log(error);
    });
};

// A function to send a GET request to get the current user
export const getOneUser = async (app, id) => {
  const url = `${API_HOST}/api/users/${id}`;

  await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get user with id");
      }
    })
    .then((json) => {
      app.setState({ user: json });
    })
    .catch((err) => {
      console.log(err);
    });
};

// A function to send a GET request to get the post Creator's name and image
export const getCreator = async (app, id) => {
  const url = `${API_HOST}/api/users/${id}`;

  await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not get user with id");
      }
    })
    .then((json) => {
      if (json === undefined) {
        return;
      }
      app.setState({
        creator: { creator_name: json.username, creator_pic: json.profilePic },
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// A function to send a PUT request to update user profile Picture
export const patchUserProfilePicture = (update, id, app) => {
  const request = new Request(`${API_HOST}/api/user/profilepic/${id}`, {
    method: "put",
    body: update,
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not patch user");
      }
    })
    .then((json) => {
      app.setState({ user: json });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Update the Bio of the user
export const updateBio = (app, bio, id) => {
  const request = new Request(`${API_HOST}/api/user/bio/${id}`, {
    method: "put",
    body: JSON.stringify(bio),
    headers: {
      "Content-Type": "application/json",
    },
  });

  fetch(request)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        alert("Could not update user bio");
      }
    })
    .then((json) => {
      app.setState({ user: json.user, bio: json.bio, editting: false });
    })
    .catch((err) => {
      console.log(err);
    });
};
