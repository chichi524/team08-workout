import "./App.css";
import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./Login";
import Homepage from "./Homepage/Homepage";
import Admin from "./Admin/Admin";
import Signup from "./Signup/Signup";
import PicturePost from "./Post_Templates/PicturePost";
import BlogPost from "./Post_Templates/BlogPost";
import VideoPost from "./Post_Templates/VideoPost";
import PicEditPage from "./PicEditPage/PicEditPage";
import BlogEditPage from "./BlogEditPage/BlogEditPage";
import VideoEditPage from "./VideoEditPage/VideoEditPage";

import '@fontsource/roboto';

import ProfilePage from "./Profile_Page/ProfilePage";

import { checkSession } from "./actions/user";

class App extends React.Component {

  componentDidMount() {
    checkSession(this); // sees if a user is logged in
  }

  // global state passed down includes the current logged in user.
  state = {
      currentUser: null
  }


  render(){
    const { currentUser } = this.state;
    return (
      <BrowserRouter>
        <div className="App">
          <div>
            <Routes>

            {currentUser === '6062c2958091680b946b1ade' ?
              <Route exact path={["/", "/login"]}                         
                      render={ props => (
                        <div>
                          {!currentUser ? <Login {...props} app={this} /> : <Admin {...props} app={this} />}
                        </div>
                        )} 
              /> 
              :<Route exact path={["/", "/login"]}                         
                      render={ props => (
                        <div>
                          {!currentUser ? <Login {...props} app={this} /> : <Homepage {...props} app={this} />}
                        </div>
                        )} 
              /> 
              }

              <Route exact path={["/homepage"]}                         
                      render={ props => (
                        <div>
                          {!currentUser ? <Login {...props} app={this} /> : <Homepage {...props} app={this} />}
                        </div>
                        )} 
              /> 

              <Route exact path={"/picturepost/:id"}        
                      render={ props => (
                            <div>
                              {!currentUser ? <Login {...props} app={this} /> : <PicturePost {...props} app={this} />}
                            </div>
                        )} 
              />



              <Route exact path={"/blogpost/:id"}        
                      render={ props => (
                            <div>
                                 {!currentUser ? <Login {...props} app={this} /> : <BlogPost {...props} app={this} />}
                            </div>
                        )} 
              />



              <Route exact path={"/videopost/:id"}        
                      render={ props => (
                            <div>
                                 {!currentUser ? <Login {...props} app={this} /> : <VideoPost {...props} app={this} />}
                            </div>
                        )} 
              />


              <Route exact path={"/uploadvideo"}        
                      render={ props => (
                            <div>
                                 {!currentUser ? <Login {...props} app={this} /> : <VideoEditPage {...props} app={this} />}
                            </div>
                        )} 
              />  

              <Route exact path={"/uploadpicture"}        
                      render={ props => (
                            <div>
                                 {!currentUser ? <Login {...props} app={this} /> : <PicEditPage {...props} app={this} />}
                            </div>
                        )} 
              /> 
              <Route exact path={"/uploadblog"}        
                      render={ props => (
                            <div>
                                 {!currentUser ? <Login {...props} app={this} /> : <BlogEditPage {...props} app={this} />}
                            </div>
                        )} 
              />
              <Route exact path={"/admin"} 
                      render={ props => (
                            <div>
                                 {!currentUser || currentUser !== '6062c2958091680b946b1ade' ? <Login {...props} app={this} /> : <Admin {...props} app={this} />}
                            </div>
                        )}  />

              <Route path={"/signup"} exact component={Signup} />

              <Route exact path={"/profile"}        
                      render={ props => (
                            <div>
                                 {!currentUser ? <Login {...props} app={this} /> : <ProfilePage {...props} app={this} />}
                            </div>
                        )} 
              />

              <Route render={() => <h1>404 Not found</h1>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;