import React from 'react';
import './Homepage.css'
import {Link} from 'react-router-dom'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import {IconButton, Input} from '@material-ui/core';
import Header from '../Header/Header'
import { getAllPosts, getFile } from "../actions/post";
import { changeLike } from '../actions/post';
import { getOneUser } from '../actions/user';


class Homepage extends React.Component{
    constructor(props){
        super(props)
        if (this.props.location.state === undefined){
            this.state = {
                video: true,
                blog: true,
                picture: true,
                stretching: true,
                jogging: true,
                yoga: true,
                weight_training: true,
                cardio: true,
                health: true,
                beginner: true,
                intermediate: true,
                advanced: true,
                other: true,
                posts: [],
                filteredPosts: [],
                searchInput: "",
                user: null
            }
        }
        else{
            this.state = this.props.location.state.state
            this.props.history.replace(this.props.location.pathname, this.state);
            
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location && this.props.location.state !== undefined) {
          this.setState(this.props.location.state.state);
        }
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

    async componentDidMount() {
        const { app } = this.props;
        const userID = app.state.currentUser
        Promise.all([
            await getOneUser(this, userID),
            await getAllPosts(this),
          ]).then(this.setState({filteredPosts: this.state.posts}))
      }

    
    handleChange(e){
        const {id} = e.target;
        this.setState((prevState) => ({
            [id]: !prevState[id]
        }))
    }

    async handleClick(post_id){

        let likeObj = {
            like: 0
        }
        
        if(this.state.user.likedposts.includes(post_id)){
            likeObj.like = -1;
        } else {
            likeObj.like = 1;
        }

        Promise.all([await changeLike(likeObj, post_id, this)]).then(this.setState({filteredPosts: this.state.posts}));
    }
    
    render() {
        let like_button;
        let button_color;
        const { app } = this.props;
        const userObj = this.state.user;
        const filteredPostsInverse = [...this.state.filteredPosts];

        return (

        <div>

            <div className="main_container">
               <div className="left_filter">                
                <div style={{marginLeft:"1em"}}>
                <Input id="searchInput" value={this.state.searchInput} placeholder="Search posts ..." onChange={this.handleSearchChange}/>
                    </div>
               
                    <h3>TYPE</h3>
                    <div className="type_filter">
                        <ul className="cbox">
                            <li id="v">
                                <input type="checkbox" id="video" checked={this.state.video} onChange={this.handleChange} />
                                <label htmlFor="video">Video Posts</label>
                            </li>
                            <li id="b">
                                <input type="checkbox" id="blog" checked={this.state.blog} onChange={this.handleChange} />
                                <label htmlFor="blog">Blog Posts</label>
                            </li>
                            <li id="p">
                                <input type="checkbox" id="picture" checked={this.state.picture} onChange={this.handleChange} />
                                <label htmlFor="picture">Picture Posts</label>
                            </li>
                        </ul>
                    </div>
                    <h3 className="change">DIFFICULTY</h3>
                    <div className="level_filter">
                        <ul className="cbox">
                            <li>
                                <input type="checkbox" id="beginner" checked={this.state.beginner} onChange={this.handleChange} />
                                <label htmlFor="beginner">Beginner</label>
                            </li>
                            <li>
                                <input type="checkbox" id="intermediate" checked={this.state.intermediate} onChange={this.handleChange} />
                                <label htmlFor="intermediate">Intermediate</label>
                            </li>
                            <li>
                                <input type="checkbox" id="advanced" checked={this.state.advanced} onChange={this.handleChange} />
                                <label htmlFor="advanced">Advanced</label>
                            </li>
                        </ul>
                    </div>
                    <h3 className="change">CONTENT</h3>
                    <div className="content_filter">
                        <ul className="cbox">
                            <li>
                                <input type="checkbox" id="stretching" checked={this.state.stretching} onChange={this.handleChange} />
                                <label htmlFor="stretching">Stretching</label>
                            </li>
                            <li>
                                <input type="checkbox" id="jogging" checked={this.state.jogging} onChange={this.handleChange} />
                                <label htmlFor="jogging">Jogging</label>
                            </li>
                            <li>
                                <input type="checkbox" id="yoga" checked={this.state.yoga} onChange={this.handleChange} />
                                <label htmlFor="yoga">Yoga</label>
                            </li>
                            <li>
                                <input type="checkbox" id="weight_training" checked={this.state.weight_training} onChange={this.handleChange} />
                                <label htmlFor="weight_training">Weight Training</label>
                            </li>
                            <li>
                                <input type="checkbox" id="cardio" checked={this.state.cardio} onChange={this.handleChange} />
                                <label htmlFor="cardio">Cardio</label>
                            </li>
                            <li>
                                <input type="checkbox" id="health" checked={this.state.health} onChange={this.handleChange} />
                                <label htmlFor="health">Health</label>
                            </li>
                            <li>
                                <input type="checkbox" id="other" checked={this.state.other} onChange={this.handleChange} />
                                <label htmlFor="other">Other</label>
                            </li>
                        </ul>
                    </div>
                </div>



                <div className="main_content_container">
                    {filteredPostsInverse.reverse().map(function(post, i){
                        if (!this.state[post.type]){
                            return null;
                        }
                        for(let x = 0; x < post.filters.length; x++){
                            if (!this.state[post.filters[x]]){
                                return null
                            }
                        }
                        if(userObj !== null && userObj.likedposts.includes(post._id)){
                            like_button = <FavoriteIcon />;
                            button_color = "secondary";
                        } else {
                            like_button = <FavoriteBorderIcon />;
                            button_color = "default";
                        }   
                        return(
                            
                            <div className={"content", post.type} key={i}> 
                                
                                <Link className="link" to={{
                                    pathname: `/${post.type}post/${post._id}`,
                                    state: {
                                        post: post,
                                        state: this.state,
                                    }
                                }}>
                                    <h2 className="post_title_home">{post.title}</h2><br/>
                                    <div className="thumbnail_container">
                                        {post.type === "video" ? <video className="thumbnail" ><source src={getFile(post.thumbnail)} /></video> : <img src={getFile(post.thumbnail)} className="thumbnail" alt="image"/>}
                                    </div>
                                    
                                    <div className="short_description">
                                        <p>{post.description}</p>
                                    </div>
                                    
                                </Link>
                                <div className='like_block_main'>
                                    <div>
                                        <IconButton aria-label="delete" id={i} onClick={() => this.handleClick(post._id)}
                                            color={button_color}>
                                            {like_button}
                                        </IconButton>
                                    </div>
                                    <span className='like_num_main'>{post.likes}</span>
                                </div>
                                
                            </div>
                            
                            
                        )
                    }, this)
                    }
                </div>
            </div>
                <Header app={app} state={this.state} />
        </div>
                
        )
    }
}

export default Homepage;