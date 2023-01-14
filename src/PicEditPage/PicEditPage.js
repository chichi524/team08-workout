import React from 'react';
import './PicEditPage.css';
import {Link} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addPicPost } from '../actions/post';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


class PicEditPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            post: {},
            picNum: 1,
            input_title: "",
            filter: [],
            content: [{picture: '', description: '', pic_name: ''}],
            alarm: false,
            backdrop: false,
        }
        this.addField = this.addField.bind(this);
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
        this.handleChange5 = this.handleChange5.bind(this);
        this.handleChange6 = this.handleChange6.bind(this);
        this.handleChange7 = this.handleChange7.bind(this);
        this.handleChange8 = this.handleChange8.bind(this);
        this.handleChange9 = this.handleChange9.bind(this);
        this.handleChange10 = this.handleChange9.bind(this);
        this.inputTitle = this.inputTitle.bind(this);
        this.addPic = this.addPic.bind(this);
        this.addInstruction = this.addInstruction.bind(this);
        this.postPic = this.postPic.bind(this);
        this.closeAlarm = this.closeAlarm.bind(this);
    }

    addPic(e){
        let new_content = this.state.content;

        for(let i = 0; i < this.state.picNum; i++){
            let num = e.target.id;
           
            if(num == i){
                new_content[i].picture = e.target.files[0];
                new_content[i].pic_name = e.target.files[0].name.substring(0, 50);
            }
            this.setState({
                content: new_content
            })
        }
    }

    addInstruction(e){
        let new_content = this.state.content;
        
        for(let i = 0; i < this.state.picNum; i++){
            let num = e.target.id;
            if(num == i){
                new_content[i].description = e.target.value;
            }
            this.setState({
                content: new_content
            })
        }
    }

    postPic(){
        let { app } = this.props;

        let open_alarm = false;
        let content = this.state.content;
        let picObj;
        let empty = true;

        for(let i = 0; i < content.length; i++){
            if((content[i].picture == '' && content[i].description != '') ||
            (content[i].picture != '' && content[i].description == '')){
                open_alarm = true;
                break;
            } else if(content[i].picture != ''){
                empty = false;
            }
        }

        if(this.state.input_title == '' || empty == true || this.state.filter.length == 0){
            open_alarm = true;
        } 

        if(open_alarm == false) {
            const pic_arr = [];
            const text_arr = [];
            for(let i = 0; i < content.length; i++){
                if(content[i].description != '' && content[i].picture != ''){
                    pic_arr.push(content[i].picture);
                    text_arr.push(content[i].description);
                }
            }

            let pic_description = this.state.content[0].description;
            if(pic_description.length > 120){
                pic_description = this.state.content[0].description.substring(0, 115) + "...";
            } 

            picObj = {
                title: this.state.input_title,
                filters: this.state.filter,
                description: pic_description,
                picture_content: text_arr,
                userID: app.state.currentUser
            }

            let form_data = new FormData();
            for(let key in picObj){
                if(key == "filters"){
                    let filter_arr = picObj[key];
                    for(let j = 0; j < filter_arr.length; j++){
                        form_data.append(key, filter_arr[j]);
                    }
                } 
                else if(key == "picture_content"){
                    for(let j = 0; j < text_arr.length; j++){
                        form_data.append(key, text_arr[j]);
                    }
                }
                else {
                    form_data.append(key, picObj[key]);
                } 
            }
            for(let i = 0; i < pic_arr.length; i++){
                form_data.append("pic", pic_arr[i]);
            }

            addPicPost(form_data, this);

        } else {
            this.setState({
                alarm: open_alarm,
            });
        }
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

    addField(e){
        let new_content = this.state.content;
        new_content.push({picture: '', description: '', pic_name: ''});
        const num = this.state.picNum + 1;
        this.setState({
            picNum: num,
            content: new_content
        })
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
                    <h1 className='header_text1'>Create your picture instructions</h1>
                    <span className='header_text2'>
                        Please fill all required (<span className='required'>*</span>) inforamtion below to create your own picture instructions
                    </span>
                </div>
                <div className="blog_title">
                    <strong>Post title (Max 30 characters) <span className='required'>*</span></strong>
                    <form className="blog_title_input" noValidate autoComplete="off" onSubmit={(e) => {e.preventDefault();}}>
                        <div>
                            <TextField
                                id="standard-multiline-flexible"
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
                    <div className='level_checkbox'>
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
                    <strong>What is the type of workout? <span className='required'>*</span></strong>
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

                <div>
                    {
                       [...Array(this.state.picNum)].map((undefined, number) => {
                            return(
                                <div key={number}>
                                    <div className='blog_pic'>
                                        <strong>Upload a picture <span className='required'>*</span></strong>
　　　　                                 <input type="file" id={"picture", number.toString()} name="pic_post" 
                                        accept="image/*" onChange={this.addPic} />
                                        <label htmlFor={"picture", number.toString()}>
                                            <Button variant="contained" color="default" component='span'
                                            startIcon={<CloudUploadIcon />}>
                                                Upload
                                            </Button>
                                        </label>
                                        <span className='file_name'>{this.state.content[number].pic_name}</span>
                                        <br></br>
                    
                                        <br></br>
                                        <strong>Add some descriptions about the picture <span className='required'>*</span></strong>
                                        <form className="blog_text_input" noValidate autoComplete="off">
                                        <div>
                                            <TextField
                                            id={"instruction", number.toString()}
                                            label="Insert your descriptions here"
                                            placeholder=""
                                            multiline
                                            variant="outlined"
                                            fullWidth
                                            rows={5}
                                            onChange={this.addInstruction}
                                            />
                                        </div>
                                        </form>
                                    </div>
                                </div>
                            )
                       }, this)
                    }
                </div>

                <div className='add_button'>
                    <Fab color="primary" aria-label="add" onClick={this.addField}>
                        <AddIcon />
                    </Fab>
                </div>

                <div className='blog_button'>
                    <div className='post_button'>
                        <Button variant="contained" color="primary" onClick={() => this.postPic()}>
                                Post
                        </Button>
                        <Dialog
                                open={this.state.alarm}
                                onClose={this.closeAlarm}
                                aria-labelledby="alert_dialog_title"
                                aria-describedby="alert_dialog_description">
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
                    <div>
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
export default PicEditPage;