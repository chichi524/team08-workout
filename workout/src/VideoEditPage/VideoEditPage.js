import React from 'react';
import './VideoEditPage.css';
import {Link} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addVideoPost } from '../actions/post';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
Link = require("react-router-dom").Link;
class VideoEditPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            post: {},
            input_title: "",
            input_description: "",
            filter: [],
            video: '',
            alarm: false,
            backdrop: false,
            file_name: ''
        }
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
        this.handleChange5 = this.handleChange5.bind(this);
        this.handleChange6 = this.handleChange6.bind(this);
        this.handleChange7 = this.handleChange7.bind(this);
        this.handleChange8 = this.handleChange8.bind(this);
        this.handleChange9 = this.handleChange9.bind(this);
        this.handleChange10 = this.handleChange10.bind(this);
        this.inputTitle = this.inputTitle.bind(this);
        this.inputDescription = this.inputDescription.bind(this);
        this.uploadVideo = this.uploadVideo.bind(this);
        this.postVideo = this.postVideo.bind(this);
        this.closeAlarm = this.closeAlarm.bind(this);
    }

    handleChange1(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('beginner')){
            new_filter.push("beginner");
        } else {
            const index = new_filter.indexOf("beginner");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange2(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('intermediate')){
            new_filter.push("intermediate");
        } else {
            const index = new_filter.indexOf("intermediate");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange3(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('advanced')){
            new_filter.push("advanced");
        } else {
            const index = new_filter.indexOf("advanced");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange4(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('stretching')){
            new_filter.push("stretching");
        } else {
            const index = new_filter.indexOf("stretching");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange5(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('jogging')){
            new_filter.push("jogging");
        } else {
            const index = new_filter.indexOf("jogging");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange6(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('yoga')){
            new_filter.push("yoga");
        } else {
            const index = new_filter.indexOf("yoga");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange7(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('weight_training')){
            new_filter.push("weight_training");
        } else {
            const index = new_filter.indexOf("weight_training");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange8(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('cardio')){
            new_filter.push("cardio");
        } else {
            const index = new_filter.indexOf("cardio");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange9(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('health')){
            new_filter.push("health");
        } else {
            const index = new_filter.indexOf("health");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    handleChange10(event){
        let new_filter = this.state.filter;
        if(!new_filter.includes('other')){
            new_filter.push("other");
        } else {
            const index = new_filter.indexOf("other");
            new_filter.splice(index, 1);
        }
        this.setState({
            filter: new_filter
        })
    }

    inputTitle(e){
        if(e.target.value.length > 30){
            e.target.value = e.target.value.substring(0, 30); 
        } 

        this.setState({
            input_title: e.target.value
        })
    }

    inputDescription(e){
        if(e.target.value.length > 120){
            e.target.value = e.target.value.substring(0, 120); 
        } 

        this.setState({
            input_description: e.target.value
        })
    }

    uploadVideo(e){
        this.setState({
            video: e.target.files[0],
            file_name: e.target.files[0].name.substring(0, 50)
        })
    }

    postVideo(){
        let { app } = this.props;

        let open_alarm = false;
        let videoObj;

        if(this.state.input_title == '' || this.state.video == '' || 
        this.state.filter.length == 0){
            open_alarm = true;

            this.setState({
                alarm: open_alarm,
            });
        } else {
            videoObj = {
                title: this.state.input_title,
                filters: this.state.filter,
                description: this.state.input_description,
                video: this.state.video,
                userID: app.state.currentUser
            }

            let form_data = new FormData();
            for(let key in videoObj){
                if(key == "filters"){
                    let filter_arr = videoObj[key];
                    for(let j = 0; j < filter_arr.length; j++){
                        form_data.append(key, filter_arr[j]);
                    }
                } else {
                    form_data.append(key, videoObj[key]);
                }
            }

            addVideoPost(form_data, this);
        }
    }

    closeAlarm(e){
        this.setState({
            alarm: false
        })
    }

    render(){
        return(
            <div className='whole_page'>
                <div className="backdrop">
                    <Backdrop open={this.state.backdrop}>
                        <CircularProgress className='loader'/>
                    </Backdrop>
                </div>
                <div className='blog_edit_header'>
                    <h1 className='header_text1'>Create your own video post</h1>
                    <span className='header_text2'>
                        Please fill all required (<span className='required'>*</span>) inforamtion below to create your own video post
                    </span>
                </div>
                <div className="blog_title">
                    <strong>Post title (Max 30 characters) <span className='required'>*</span></strong>
                    <form className="blog_title_input" noValidate autoComplete="off" onSubmit={(e) => {e.preventDefault();}}>
                        <div>
                            <TextField
                                label="Insert your title here"
                                placeholder=""
                                fullWidth
                                onChange={this.inputTitle}
                            />
                        </div>
                    </form>
                </div>

                <div className='workout_level'>
                    <strong>How difficult is the workout? <span className='required'>*</span></strong>
                    <div className='level_radio'>
                        <FormControl>
                            <FormGroup>
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange1} name="beginner" />}
                                label="Beginner"
                            />
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange2} name="intermediate" />}
                                label="Intermediate"
                            />
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange3} name="advanced" />}
                                label="Advanced"
                            />
                            </FormGroup>
                        </FormControl>
                    </div>
                </div>

                <div className='blog_type'>
                    <strong>What is the type of the workout? <span className='required'>*</span></strong>
                    <div className='type_checkbox'>
                        <FormControl>
                            <FormGroup>
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange4} name="sketching" />}
                                label="Stretching"
                            />
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange5} name="jogging" />}
                                label="Jogging"
                            />
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange6} name="yoga" />}
                                label="Yoga"
                            />
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange7} name="weight_training" />}
                                label="Weight Training"
                            />
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange8} name="cardio" />}
                                label="Cardio"
                            />
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange9} name="health" />}
                                label="Health"
                            />
                            <FormControlLabel
                                control={<Checkbox color='primary' onChange={this.handleChange10} name="other" />}
                                label="Other"
                            />
                            </FormGroup>
                        </FormControl>
                    </div>
                </div>

                <div className='blog_pic'>
                    <strong>Upload an video <span className='required'>*</span></strong>
　　　　             <input type="file" id="image-file" name="blog_pic" 
                    accept="video/*" onChange={this.uploadVideo}/>
                    <label htmlFor="image-file">
                    <Button variant="contained" color="default" component='span'
                        startIcon={<CloudUploadIcon />}>
                            Upload
                        </Button>
                    </label>
                    <span className='file_name'>{this.state.file_name}</span>
                </div>

                <div className='blog_text'>
                    <strong>Descriptions about the video (Max 120 characters) <span className='required'>*</span></strong>
                    <form className="blog_text_input" noValidate autoComplete="off">
                        <div>
                            <TextField
                                label="Insert your descriptions here (Max 120 characters)"
                                placeholder=""
                                multiline
                                variant="outlined"
                                fullWidth
                                rowsMax={5}
                                onChange={this.inputDescription}
                            />
                        </div>
                    </form>
                </div>

                <div className='blog_button'>
                    <div className='post_button'>
                        <Button variant="contained" color="primary" onClick={() => this.postVideo()}>
                                Post
                        </Button>
                        <Dialog
                                open={this.state.alarm}
                                onClose={this.closeAlarm}
                                aria-labelledby="alert_dialog_title"
                                aria-describedby="alert_dialog_description"
                        >
                            <DialogTitle id="alert_dialog_title">
                                {"Cannot post"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert_dialog_description">
                                You need to fill in all required information before posting 
                                </DialogContentText>
                            </DialogContent>                            
                            <DialogActions>
                                <Button onClick={this.closeAlarm} color="primary" autoFocus>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className='cancel_button'>
                        <Link to={"/homepage"} className='cancel_button'>
                            <Button variant="outlined" color="primary">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        )
    }
}
export default VideoEditPage;