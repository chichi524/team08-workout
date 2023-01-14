import React from 'react';
import './PicturePost.css';
import { Button } from '@material-ui/core';
import './Post.css';
import TextField from '@material-ui/core/TextField';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import Header from '../Header/Header'
import { getFile } from "../actions/post";
import { getOneUser, getCreator } from '../actions/user';
import { addComment } from '../actions/post';
import { changeLike } from '../actions/post';
import { getAllComments } from "../actions/post";
import ProfilePic from '../DEFAULT_PIC/profilePic.jpg'


class PicturePost extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            post: this.props.location.state.post,
            textFieldValue:'',
            user: null,
            comments: [],
            creator: {}
        }
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
        this.addPicComment = this.addPicComment.bind(this)
        this.changePicLike = this.changePicLike.bind(this)
    }

    componentDidMount() {
        const { app } = this.props;
        const userID = app.state.currentUser
        Promise.all([
            getOneUser(this, userID),
            getCreator(this, this.state.post.creator),
            getAllComments(this, this.state.post),
          ])
    }

    handleTextFieldChange(event){
        this.setState({
            textFieldValue: event.target.value
        })
    }

    addPicComment(event){
        const commentObj = {
            comment: this.state.textFieldValue
        }
        addComment(commentObj, this.state.post._id, this)
    }

    changePicLike(e){
        let likeObj = {
            like: 0
        }
        if(this.state.user.likedposts.includes(this.state.post._id)){
            likeObj.like = -1;
        } else {
            likeObj.like = 1;
        }

        changeLike(likeObj, this.state.post._id, this);
    }



    render(){
        let like_button;
        let button_color;
        if(this.state.user !== null && this.state.user.likedposts.includes(this.state.post._id)){
            like_button = <FavoriteIcon />;
            button_color = "secondary";
        } else {
            like_button = <FavoriteBorderIcon />;
            button_color = "default";
        }

        let comment_disabled;
        if(this.state.textFieldValue == ''){
            comment_disabled = true;
        } else {
            comment_disabled = false;
        }

        const { app } = this.props;

        let month_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                        'October', 'November', 'December']
        let year = this.state.post.datecreated.substring(0, 4);
        let month_num = parseInt(this.state.post.datecreated.substring(5, 7));
        let month = month_arr[month_num - 1];
        let date = this.state.post.datecreated.substring(8, 10);
        let create_date = month + ' ' + date + ', ' + year;

        return(
            <div>
                
            <div className="main_container">
                <div className='title_block2'>
                <span className="post_blog_title">{this.state.post.title}</span>
                    <img className='profilePic' src={this.state.creator.creator_pic === undefined || this.state.creator.creator_pic === '' ? ProfilePic : getFile(this.state.creator.creator_pic)}/>
                    <span className='blog_username'>{this.state.creator.creator_name}</span>
                    <span className='blog_username'>{create_date}</span>
                </div>

                <div className="grid_container">
                    {this.state.post.picture_content.map(function(content, x){
                        return(
                            <div key={x} className="rows">
                                <div className="image_container" >
                                    <img src={getFile(content.picture)} className="image" />
                                </div>
                                <div className="description_container" >
                                    <p className="description">{content.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='like_block'>
                    <div>
                        <IconButton aria-label="like" color={button_color}
                        onClick={this.changePicLike}>
                            {like_button}
                        </IconButton>
                    </div>
                    <span className='like_num'>{this.state.post.likes}</span>
                </div>
                <hr className='separate_line'></hr>
                <div className='comment'>
                <span className='comment_num'>{this.state.comments.length} comments in total</span>
                    <div className='comment_block'>
                    <img className='profilePic2' src={this.state.user === null || this.state.user.profilePic === '' ? ProfilePic : getFile(this.state.user.profilePic)}/>
                        <div className='comment_input'>
                            <TextField id="standard-password-input" 
                            label="Comment" autoComplete="current-password" fullWidth multiline
                            value={this.state.textFieldValue}
                            onChange={this.handleTextFieldChange}>
                            </TextField>
                        </div>
                    </div>
                    <div className='comment_button'>
                        <Button variant="contained" color="primary" onClick={this.addPicComment} disabled={comment_disabled}>Comment</Button>
                    </div>
                    <div className='comment_list'>
                        {
                            this.state.comments.map(function(cur, index){
                                return(
                                    <div className='comment_block2' key={index} >
                                        <img className='profilePic2' src={cur.profile === ''? ProfilePic : getFile(cur.profile)}/>
                                        <div className='comment_content'>
                                            <div className='comment_name'><span>{cur.name}</span></div>
                                            <p>{this.state.post.comment_list[index].comment}</p>
                                        </div>
                                    </div>
                                )
                            }, this)
                        }
                    </div>
                </div>
                
                </div>
                <Header app={app} state={this.props.location.state.state} />
            </div>
        )
    }
}

export default PicturePost
