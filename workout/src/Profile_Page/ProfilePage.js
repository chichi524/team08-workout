import React from "react";
import {Link} from 'react-router-dom';
import default_pic from '../DEFAULT_PIC/profilePic.jpg'
import './ProfilePage.css'
import Header from '../Header/Header'
import Button from '@material-ui/core/Button';
import { allPostFromUser, patchUserProfilePicture, updateBio } from "../actions/user";
import { getFile, deletePost } from "../actions/post";
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ContentEditable from 'react-contenteditable'


class ProfilePage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            posts: [],
            user: null,
            bio: "",
            editting: false,
            open_confirm: false,
            post_index: -1
        }
        this.delete = this.delete.bind(this)
        this.changePic = this.changePic.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleClose1 = this.handleClose1.bind(this)
        this.handleClose2 = this.handleClose2.bind(this)
    }

    componentDidMount(){
        Promise.all([
            allPostFromUser(this.props.app.state.currentUser, this),
          ])
    }


    handleChange(e){
        const value = e.target.value
        this.setState({bio: value})
    }

    handleClick(e){
        if (this.state.editting){
            //upload to database
            const bioObj = {"bio": this.state.bio}
            updateBio(this, bioObj, this.props.app.state.currentUser)
        }
        else{
            //make it edditable
            this.setState({editting: true})
        }
    }



    delete(e){
        let index;
        if(e.target.value == undefined){
            if(e.target.parentNode.value == undefined){
                if(e.target.parentNode.parentNode.value == undefined){
                    index = e.target.parentNode.parentNode.parentNode.value
                } else {
                    index = e.target.parentNode.parentNode.value
                }
            } else {
                index = e.target.parentNode.value
            }
        } else {
            index = e.target.value
        }
        console.log(index)
        this.setState({
            open_confirm: true,
            post_index: index
        })
    }

    changePic(e){
        let update = new FormData();
        update.append("profile_pic", e.target.files[0])
        patchUserProfilePicture(update, this.props.app.state.currentUser, this)

    }

    handleClose1(e){
        let copy = this.state.posts.slice()
        deletePost(this.state.posts[this.state.post_index]._id)
        copy.splice(this.state.post_index, 1)
        this.setState({
            posts: copy,
            open_confirm: false,
            post_index: -1
        })
    }

    handleClose2(e){
        this.setState({
            open_confirm: false,
            post_index: -1
        })
    }

    render(){
        let likes=0;
        for (let i = 0; i < this.state.posts.length; i++){
            likes += parseInt(this.state.posts[i].likes)
        }
        const { app } = this.props;

        return(
            <div className="main_container">
                
                <div className="profile_container">
                    <div className="profile">
                        <div className="profile-image-container">
                            <img src={this.state.user === null || this.state.user.profilePic === '' ? default_pic : getFile(this.state.user.profilePic)} className="profile-image" />
                            <div className='profile-pic-upload'> 
                            <input type="file" id="test-image-file" name="profile_pic" 
                            accept="image/*" onChange={this.changePic} />
                            <label htmlFor="test-image-file">
                                <Button variant="contained" color="default" component='span'>
                                Upload
                                </Button>
                            </label>
                        </div>
                    </div>
                        <div className="profile-user-settings">
                            <h1 className="profile-user-name">{this.state.user !== null ? this.state.user.username : "user"}</h1>
                            <button className="profile-edit-btn" onClick={this.handleClick} >{this.state.editting? "Update":"Edit Profile Bio"}</button>
                        </div>

                        <div className="profile-stats">
                            <ul>
                                <li><span className="profile-stat-count">{this.state.posts.length}</span> posts</li>
                                <li><span className="profile-stat-count">{likes}</span> likes</li>
                            </ul>
                        </div>

                        <div className="profile-bio">
                            <ContentEditable id="bio" 
                            className="bio-text" 
                            disabled={!this.state.editting} 
                            html={this.state.bio}
                            style={this.state.editting? {backgroundColor: "white"}: {backgroundColor: "mistyrose"}} 
                            onChange={this.handleChange}
                            />
                        </div>

                    </div>
                </div>
                <hr className='separate_line'></hr>
                    
                <div className="profile_container">
                    <span className="profile_your_posts">Your posts: </span>
                    <div className="gallery">
                    {this.state.posts.map(function(post, i){
                        return(
                            <div className={"gallery-item", post.type} key={i}> 
                                <Link className="link" to={{
                                    pathname: `/${post.type}post/${post._id}`,
                                    state: {
                                        post: post,
                                        state: this.props.location.state.state
                                    }
                                }}>
                                    <div className='profile_title_container'>
                                        <h2>{post.title}</h2>
                                    </div>
                                    <div className='profile_thumbnail_container'>
                                    {post.type === "video" ? 
                                    <video className={"thumbnail", "profile-thumbnail"} ><source src={getFile(post.thumbnail)} /></video> 
                                    : 
                                    <img src={getFile(post.thumbnail)} className={"thumbnail", "profile-thumbnail"} alt="image"/>}
                                    </div>
                                    <br />
                                    <p className="short_description">{post.description}</p>
                                </Link>
                                <IconButton className="delete_btn_profile" onClick={this.delete} value={i}>
                                    <DeleteIcon className='delete_icon' fontSize="large" color="default" />
                                </IconButton>
                                <Dialog open={this.state.open_confirm}>
                                    <DialogTitle>{"Are you sure you want to delete this post?"}</DialogTitle> 
                                    <DialogActions>
                                        <Button onClick={this.handleClose2} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={this.handleClose1} color="primary" autoFocus value={i}>
                                            Delete
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        )
                    }, this)
                    }
                    </div>
                </div>
                <Header app={app} change={this.state.user} state={this.props.location.state.state} />
            </div>
        )
    }
}

export default ProfilePage