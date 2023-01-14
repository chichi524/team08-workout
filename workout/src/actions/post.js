// environment configutations
import { Alarm } from '@material-ui/icons';
import ENV from './../config.js'
import { getAllUsers } from './user.js';
const API_HOST = ENV.api_host


export const addBlogPost = (post, page) => {
    page.setState({
        backdrop: true
    })

    const url = `${API_HOST}/api/upload_blog`;

    const request = new Request(url, {
        method: "post",
        body: post,
    });

    fetch(request)
        .then((res) => {
            page.setState({
                backdrop: false
            })
            if(res.status == 200){
                let homepage_url = window.location.origin + '/homepage';
                window.location.assign(homepage_url);
            } else {
                alert("Error: add a blog post");
            }
        })
        .catch(error => {
            console.log(error)
        })
}

export const addPicPost = (post, page) => {
    page.setState({
        backdrop: true
    })

    const url = `${API_HOST}/api/upload_picture`;

    const request = new Request(url, {
        method: "post",
        body: post
    });

    fetch(request)
        .then((res) => {
            page.setState({
                backdrop: false
            })

            if(res.status == 200){
                let homepage_url = window.location.origin + '/homepage';
                window.location.assign(homepage_url);
            } else {
                alert("Error: add a picture post");
            }
        })
        .catch(error => {
            console.log(error)
        })
}

export const addVideoPost = (post, page) => {
    page.setState({
        backdrop: true
    })

    const url = `${API_HOST}/api/upload_video`;

    const request = new Request(url, {
        method: "post",
        body: post
    });

    fetch(request)
        .then((res) => {
            page.setState({
                backdrop: false
            })
            
            if(res.status == 200){
                let homepage_url = window.location.origin + '/homepage';
                window.location.assign(homepage_url);
            }
            else {
                alert("Error: add a video post");
            }
        })
        .catch(error => {
            console.log(error)
        })
}

export const addComment = async (comment, post_id, page) => {

    const url = `${API_HOST}/api/posts/${post_id}`;

    const request = new Request(url, {
        method: "put",
        body: JSON.stringify(comment),
        headers: {
            "Content-Type": "application/json",
        },
    });

    await fetch(request)
    .then((res) => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json === undefined){
          return
        }
          const new_comments = page.state.comments.slice()
          new_comments.push(json.comment)
          page.setState({ 
            post: json.post, 
            comments: new_comments,
            textFieldValue: ""
          });
    })
    .catch(error => {
        alert("Error: fail to add a comment");
    });
}

export const changeLike = async (likeObj, post_id, page) => {
    const url = `${API_HOST}/api/posts/${post_id}`;

    const request = new Request(url, {
        method: "put",
        body: JSON.stringify(likeObj),
        headers: {
          "Content-Type": "application/json",
        },  
    });

    await fetch(request)
    .then((res) => {
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json === undefined){
          return
        }
        if (page.state.post !== undefined) {
            //This is for post pages
            page.setState({ user: json.user, post: json.post });
        }
        if (page.state.posts !== undefined){
          // this is for homepage
          page.setState({ user: json.user, posts: json.posts });
        }
    })
    .catch(error => {
        alert("Error: fail to add a comment");
    });
};


// A function to send a GET request to get all of the users information
export const getAllPosts = async (postList) =>{
    const url = `${API_HOST}/api/posts`

    await fetch(url)
    .then(res => {
      if (res.status === 200){
        return res.json();
      } else{
        alert("Could not get posts");
      }
    })
    .then(json => {
      postList.setState({ posts: json })
    })
    .catch(err =>{
      console.log(err)
    })
}

export const getFile = (fileName) =>{
    const url = `${API_HOST}/api/uploads/${fileName}`

    return url;

}


export const deletePost = (postID) =>{

    const request = new Request(`${API_HOST}/api/posts/${postID}`, {
        method: "delete",
        header: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });
    
      fetch(request)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            alert("Could not delete post");
          }
        })
        .catch((err) => {
          console.log(err);
        });

}


export const getPost = async (postID, postList) => {
    const url = `${API_HOST}/api/posts/${postID}`

    await fetch(url).then(res => {
      if (res.status === 200){
        return res.json();
      } else{
        alert("Could not get post");
      }
    })
    .then(json => {
      postList.setState({ post: json })
    })
    .catch(err =>{
      console.log(err)
    })
}

// Get a list of the comments, with getting all the information from user api
export const getAllComments = async (commentList, post) => {
  const c = []
  for (let i = 0; i < post.comment_list.length; i++){
    let url = `${API_HOST}/api/users/${post.comment_list[i].userID}`
    await fetch(url).then(res => {
      if (res.status === 200){
        return res.json();
      } else{
        alert("Could not get user");
      }
    })
    .then(json => {
      c.push({ name: json.username, profile: json.profilePic })
    })
    .catch(err =>{
      console.log(err)
    })
  }
  commentList.setState({comments: c})
}
