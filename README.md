# Team 08 README

## Startup Instructions

### [Deployment Website](https://workout-309.herokuapp.com/)

Alternatively: <https://workout-309.herokuapp.com/>

### Login Credentials

Valid username / password combinations:

* For admin view: **admin / admin**
* For user view: **user / user**

## Features

### User Features

* Sign up: If a user does not have an account, the user can click the “Don't have an account?” button on the login page to enter the signup page. A user can return to the login page by clicking the "Go Back" button. On the signup page, users are required to enter username and passwords in the username field and password fields. Users need to enter the password twice to confirm the password. If the user doesn't enter the same password in each password field, a notification would be popped out and remind the user that "Your password do not match. Try again". After inputting all the required information, user clicks the “Register” button to finish the registration and return to the login page.

* Log in: Users need to log in to access to the web application. On the login page, the user enters username and password in the input fields, and click the “Login” button to enter the main page. If the user enters incorrect username or password, a notification would be popped out and remind the user that "Incorrect username or password" has been entered.

* Browse posts: Users can browse all posts posted by other people on homepage, and "like" posts by clicking the "love" button on the bottom-right of the post cover. Users can click the covers of posts they are interested in to view the full posts. The search bar and options to filter are on the left side of the webpage. Users can find a specific post by entering the title of the post in the search bar. Users can filter the posts based on the type of the post (video, picture, blog), the type of workout (stretching, yoga, jogging…) and the difficulty level (beginner, intermediate, advanced) by clicking the check boxes in the filter. Then the main page will display the filtered posts.

* View posts: Users can click the post covers on the main page to enter the content page of it. On the content page, users can view the whole post. At the bottom-right of the post content, users can click the “love” button to "like" the post. Users can also add comments in the text field at the bottom of the webpage and click the “Comment” button to post their comments. Users can also see other comments and the number of likes below the post.  

* Create posts: Users can upload post (blog, video, pictues). This is done by clicking the "+" button on the bottom-right of the web page firstly, and then users can choose the type of the post on the drop-down menu to enter the upload page. In the upload page, users need to fill in all required information about the post and click the "POST" button to upload their posts on the homepage. The video edit page can only upload one video in the video-insert box, along with a text description which has a word limit of 120. The picture edit page can upload multiple pictures. Each picture can have a text description without the word limit. The blog edit page can only upload one picture, and the text field does not have the word limit. Users can cancel editing and return to the main page by clicking the “Cancel” button.

* User Profiles: Users can click the profile pricture button on the top-right of the main page to enter the user homepage. On the user homepage, users can see their username, the number of likes they have, the number of their posts, and the covers of their own posts. Users can edit their own profile, such as the profile picture and bio. This is done on profile page by clicking a button labelled "Edit Profile". Users can delete their posts, this is also done on profile page. Wrapped inside every post, there is a button to delete the post. Users can click the post covers to see the whole post, and like or add comments on the bottom of the post content page. Users can also see the number of likes and all comments on the bottom of the post page.

* Log out: Users can log out by clicking the "Log Out" button on the top menu.

### Admin Features

* Admin Dashboard:
  * The admin account is automatically routed to this page when they log in.
  * The website statistics are displayed in a line chart created with ChartJs.
  * It displays the daily new user and daily new post count.
  * The chart includes the new user count and new post count over the past 10 days.
* Admin User Management:
  * The admin can see information about users that have registered with the website in table.
  * The users are displayed in alphabetic order.
  * The users can be searched through in a search bar by their username.
  * Information from each user is displayed, such as the date their account was created, number of posts, etc.
  * Normal users can also be deleted from the database, by clicking the delete button on the table.
    * Note: doing so also deletes their posts and likes.
  * If a user forgets their password, the admin is also able to change their password through a button.
  * The admin is unable to delete themselves or change their password through the table.
* Admin Post Management:
  * The admin can see the posts that the users have uploaded to the website.
  * This is arranged in an organized datagrid, which can be sorted by toggling the field to sort by on the row header.
  * It displays some of the metadata of each post, e.g. title, tags, number of likes, etc.
  * Each row also contains a button for the admin to head to the post.
  * The admin can select multiple posts, or all the posts, to delete them all at once by clicking the "Delete Selected Posts" button at the top right of the datagrid.
  * The search bar is able to search for a post with a specific title, containing the string provided in the search bar.

## Express Server Route Overview

Most routes reqiure authentication by checking if the user has logged in (req.session.user). The only routes that do not need authenticaion are login, logout, check-session, and post user (create account).

### Creating an account

* POST ("/api/users")
* Receive object {username: String, password: String}
* Return created user object

### login

* POST ("/users/login")
* Receive object {username: String, password: String}
* Return {currentUser: user ID}

### logout

* GET ("/users/logout")
* Receive nothing
* Return nothing

### check session

* GET ("/users/check-session")
* Receive nothing
* Return {currentUser: session user ID}

### Get all users

* GET ("/api/users")
* Receive nothing
* Return an array of all user object

### Get one user with ID

* POST ("/api/users/:id")
* Receive nothing, except user ID in parameters
* Return user object with ID

### Delete one user with ID

* DELETE ("/api/users/:id")
* Receive nothing, except user ID in parameters
* Return deleted user object with ID

### Get all posts posted by one user with ID

* GET ("/api/users/posts/:id")
* Receive nothing, except user ID in parameters
* Return {posts: array of posts, user: user object, bio: user bio}

### Change user password with ID

* PUT ("/api/users/:id")
* Receive object {password: String}
* Return updated user object

### change user profile picture with ID

* PUT ("/api/user/profilepic/:id")
* Receive user ID in parameters, and a file in object {profile_pic: FILE}
* Return updated user object

### Change one user Bio with ID

* PUT ("/api/user/bio/:id")
* Receive user ID in parameters, and object {bio: String}
* Return object {user: user object, bio: updated bio}

### Post Blog post

* POST ("/api/upload_blog")
* Receive blog object {title: String, filters: Array(String), blog_pic: FILE, description: String, blog_content: String, creator: userID}
* Return post object

### Post video post

* POST ("/api/upload_video")
* Receive blog object {title: String, filters: Array(String), video: FILE, description: String, creator: userID}
* Return post object

### Post Picture post

* POST ("/api/upload_picture")
* Receive blog object {title: String, filters: Array(String), pic: array(FILE), description: String, picture_content: array(String), creator: userID}
* Return post object

### Get all posts

* GET ("/api/posts")
* Receive nothing
* Return array of all post objects

### Get one single post with post ID

* GET ("/api/posts/:id")
* Receive nothing, except post ID in the parameter
* Return post object with post ID

### Get a file (video or picture) with filename

* GET ("/api/uploads/:filename")
* Receive nothing, except the filename in the parameter
* Return file (image or video)

### Delete post with post ID (including all files in it)

* DELETE ("/api/posts/:id")
* Receive nothing, except post ID in the parameter
* Return object {post: deleted post, user: updated user}

### Update Likes or Comments inside a post with post ID

* PUT ("/api/posts/:id")
* Receive post ID in the parameter, and one of 2 possible objects: {comment: String} or {like: Number (1 or -1)}
* Return 2 possible objects:
  * If received comments, return {post: updated post, comment: {profile: commenter's profile picture, name: commenter's username}}
  * If received like, return {post: updated post, user: updated current user, posts: array of all posts}
    * However, this can also return nothing, which is a safety measure against slower database updating with faster clicks on front end.

## Other information

### Third Party Libraries Used

#### From Phase 1

* React
* Material-UI
* ChartJs

The app was mainly built on React.
Material-UI was used to style some components of the website,
mainly the Admin pages and upload pages.
ChartJs was used to display new user and new post information on the Admin page.

#### From Phase 2

No additional libraries (aside from server-side) were used in Phase 2.
# workout-309
