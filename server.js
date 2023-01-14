"use strict";
const log = console.log;
const env = process.env.NODE_ENV;
const mongoURI =
  "mongodb+srv://wilson:wilpass@csc309-team08-phase2.2gbgu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const USE_TEST_USER = env !== "production" && process.env.TEST_USER_ON;
const TEST_USER_ID = "6062c2958091680b946b1ade";
const TEST_USER_USERNAME = "admin";

// Express
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
var jsonParser = bodyParser.json();
//app.use(express.bodyParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

// Mongo and Mongoose
const { ObjectID } = require("mongodb");
const { mongoose } = require("./db/mongoose");
const { User } = require("./models/user");
const { Post } = require("./models/post");
const MongoStore = require("connect-mongo"); // to store session information on the database in production

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const crypto = require("crypto");

// enable CORS if in development, for React local development server to connect to the web server.
const cors = require("cors");
if (env !== "production") {
  app.use(cors());
}
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
//app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//app.use(express.json({limit: '50mb'}));
//app.use(express.urlencoded({limit: '50mb'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Using grid for storage
const db = mongoose.connection;
let gfs;
db.once("open", function () {
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection("uploads");
});

//set up storage for files such as img and videos
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// Helper function
// This function uses the code in Week 8 lecture, the reference is https://q.utoronto.ca/courses/204639/pages/lectures
function isMongoError(error) {
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
}

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
  // check mongoose connection established.
  if (mongoose.connection.readyState != 1) {
    log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  } else {
    next();
  }
};

// =====================  Helper Function  ===========================

const addToUserPost = async (userID, postID) => {
  const user = await User.findById(userID);
  user.posts.push(postID);
  const result = user.save();
  return result;
};

// =====================  SESSION   ===========================

const authenticate = (req, res, next) => {
  if (env !== "production" && USE_TEST_USER) req.session.user = TEST_USER_ID;

  if (req.session.user) {
    User.findById(req.session.user)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        res.status(401).send("Unauthorized");
      });
  } else {
    res.status(401).send("Unauthorized");
  }
};

/*** Session handling **************************************/
// Create a session and session cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60000 * 60,
      httpOnly: true,
    },
    // store the sessions on the database in production
    store:
      env === "production"
        ? MongoStore.create({
            mongoUrl: mongoURI,
          })
        : null,
  })
);

// A route to login and create a session
app.post("/users/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // log(email, password);
  // Use the static method on the User model to find a user
  // by their email and password
  User.findByUsernamePassword(username, password)
    .then((user) => {
      // Add the user's id to the session.
      // We can check later if this exists to ensure we are logged in.
      req.session.user = user._id;
      req.session.username = user.username;
      res.send({ currentUser: user._id });
    })
    .catch((error) => {
      res.status(400).send({});
    });
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

// A route to check if a user is logged in on the session
app.get("/users/check-session", (req, res) => {
  if (env !== "production" && USE_TEST_USER) {
    // test user on development environment.
    req.session.user = TEST_USER_ID;
    req.session.username = TEST_USER_USERNAME;
    res.send({ currentUser: req.session.user });
    return;
  }

  if (req.session.user) {
    res.send({ currentUser: req.session.user });
  } else {
    res.status(401).send();
  }
});

// =============================================

// Post users
app.post("/api/users", mongoChecker, async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    datecreated: new Date(),
    posts: [],
    likedposts: [],
    profilePic: "",
    bio: "BIO",
  });

  try {
    const result = await user.save();
    res.send(result);
  } catch (error) {
    log(error); // log server error to the console, not to the client.
    if (isMongoError(error)) {
      // check for if mongo server suddenly dissconnected before this request.
      res.status(500).send("Internal server error");
    } else {
      res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
    }
  }
});

// Get users
app.get("/api/users", mongoChecker, authenticate, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get One user with ID
app.get("/api/users/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    res.send(user);
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete user with Id
app.delete("/api/users/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  try {
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
    }
  } catch (error) {
    log(error);
    res.status(500).send();
  }
});

// Get all Posts from the User with userID
// Return the list of the post objects

app.get(
  "/api/users/posts/:id",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      res.status(404).send();
      return; // so that we don't run the rest of the handler.
    }

    try {
      const user = await User.findById(id);
      const bio = user.bio;
      const result = [];

      if (user.posts.length === 0) {
        res.send({ posts: result, user: user, bio: bio });
      } else {
        for (let i = 0; i < user.posts.length; i++) {
          const postID = user.posts[i];
          await Post.findById(postID, function (err, r) {
            if (err) {
              res.send(err);
            } else {
              result.push(r);
              if (i === user.posts.length - 1) {
                res.send({ posts: result, user: user, bio: bio });
              }
            }
          });
        }
      }
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Put a single user (currently only for password changing)
app.put("/api/users/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;

  log(req.body);

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return; // so that we don't run the rest of the handler.
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("Resource not found");
    } else {
      log(user);
      user.password = req.body.password;

      const result = await user.save();
      res.send(result);
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

//PUT User Profile Picture. Please pass in the picture name as "profile_pic"
app.put(
  "/api/user/profilepic/:id",
  upload.single("profile_pic"),
  mongoChecker,
  authenticate,
  async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      res.status(404).send();
      return; // so that we don't run the rest of the handler.
    }

    try {
      const user = await User.findById(id);
      if (!user) {
        res.status(404).send("Resource not found");
      } else {
        user.profilePic = req.file.filename;
        const result = await user.save();
        res.send(result);
      }
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error"); // server error
    }
  }
);

//Update Bio of th user with user id
app.put("/api/user/bio/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;
  const bio = req.body.bio;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return; // so that we don't run the rest of the handler.
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("Resource not found");
    } else {
      user.bio = bio;
      const result = await user.save();
      res.send({ user: result, bio: bio });
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

//============================================================================

//POST call for blog posts. the field name for the image must be blog_pic
//return: the post object
app.post(
  "/api/upload_blog",
  upload.single("blog_pic"),
  mongoChecker,
  authenticate,
  async (req, res, next) => {
    const post = new Post({
      type: "blog",
      title: req.body.title,
      filters: req.body.filters,
      thumbnail: req.file.filename,
      likes: 0,
      description: req.body.description,
      blog_content: req.body.blog_content,
      comment_list: [],
      datecreated: new Date(),
      creator: req.body.userID,
    });

    try {
      const result = await post.save();
      addToUserPost(req.body.userID, post._id);
      res.send(result);
    } catch (error) {
      log(error); // log server error to the console, not to the client.
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
      }
    }
  }
);

//POST call for video posts. the field name for the image must be video
//return: the post object
app.post(
  "/api/upload_video",
  upload.single("video"),
  mongoChecker,
  authenticate,
  async (req, res, next) => {


    const post = new Post({
      type: "video",
      title: req.body.title,
      filters: req.body.filters,
      thumbnail: req.file.filename,
      likes: 0,
      description: req.body.description,
      video_content: req.file.filename,
      comment_list: [],
      datecreated: new Date(),
      creator: req.body.userID,
    });

    try {
      const result = await post.save();
      addToUserPost(req.body.userID, post._id);
      res.send(result);
    } catch (error) {
      log(error); // log server error to the console, not to the client.
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
      }
    }
  }
);

//POST call for Picture posts. the field name for the image must be picture_pic
//return: the post object
app.post(
  "/api/upload_picture",
  upload.array("pic"),
  mongoChecker,
  authenticate,
  async (req, res, next) => {


    const arr = [];
    let i = 0;
    if (req.files.length > 1) {
      req.files.forEach(function (file) {
        arr.push({
          picture: file.filename,
          description: req.body.picture_content[i],
        });
        i++;
      });
    } else if (req.files.length == 1) {
      req.files.forEach(function (file) {
        arr.push({
          picture: file.filename,
          description: req.body.picture_content,
        });
      });
    }

    const post = new Post({
      type: "picture",
      title: req.body.title,
      filters: req.body.filters,
      thumbnail: req.files[0].filename,
      likes: 0,
      description: req.body.description,
      picture_content: arr,
      comment_list: [],
      datecreated: new Date(),
      creator: req.body.userID,
    });

    try {
      const result = await post.save();
      addToUserPost(req.body.userID, post._id);
      res.send(result);
    } catch (error) {
      log(error); // log server error to the console, not to the client.
      if (isMongoError(error)) {
        // check for if mongo server suddenly dissconnected before this request.
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request"); // 400 for bad request gets sent to client.
      }
    }
  }
);

//============================================================================

// Get all Posts
app.get(
  "/api/posts",
  jsonParser,
  mongoChecker,
  authenticate,
  async (req, res) => {
    try {
      const posts = await Post.find();
      res.send(posts);
    } catch (error) {
      log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Get one single Post with id
app.get("/api/posts/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  try {
    const post = await Post.findById(id);
    res.send(post);
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error");
  }
});

//GET call for the file. must pass in the name of the file, which can be found inside the post
//return: the file (image or video)
app.get("/api/uploads/:filename", mongoChecker, authenticate, (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image or video
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "video/mp4"
    ) {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "File unreadable",
      });
    }
  });
});

//============================================================================

//Delete the single file. DO NOT USE IT BY ITSELF. use it with the next function to also delete the post
app.delete(
  "/api/file/:filename",
  mongoChecker,
  authenticate,
  async (req, res) => {
    const filename = req.params.filename;
    gfs.remove({ filename: filename, root: "uploads" }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      } else {
        res.send(filename);
      }
    });
  }
);

//DELETE the entire post with its id. IMPORTANT: THIS WILL ALSO DELETE THE FILES INSIDE THE POST
app.delete("/api/posts/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send(); // if invalid id, definitely can't find resource, 404.
    return; // so that we don't run the rest of the handler.
  }

  try {
    //REMOVE FILE FIRST
    const post = await Post.findByIdAndRemove(id);
    if (!post) {
      res.status(404).send();
    } else {
      //DELETE ALL FILES AS WELL
      if (post.type === "picture") {
        //go through picture_content and delete every image
        post.picture_content.forEach(function (schema) {
          const filename = schema.picture;
          gfs.remove({ filename: filename, root: "uploads" });
        });
      } else {
        //just remove the thumbnail is enough.
        const filename = post.thumbnail;
        gfs.remove({ filename: filename, root: "uploads" });
      }

      const user = await User.findById(post.creator);
      if (user) {
        user.posts.splice(user.posts.indexOf(id), 1);
        const u = user.save();
        res.send({ post: post, user: u });
      }
    }
  } catch (error) {
    log(error);
    res.status(500).send(); // server error, could not delete.
  }
});

//============================================================================

//PATCH posts. this can patch/add a comment inside the post
//can also plus/minus likes of the post. must pass in +1 or -1 in field "like"
app.put("/api/posts/:id", mongoChecker, authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return; // so that we don't run the rest of the handler.
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).send("Resource not found");
    } else {
      let result;

      if (req.body.comment !== undefined) {
        const comment_obj = {
          userID: req.session.user,
          comment: req.body.comment,
        };

        post.comment_list.push(comment_obj);

        result = await post.save();
        const u = await User.findById(req.session.user);
        res.send({
          post: result,
          comment: { profile: u.profilePic, name: u.username },
        });
      } else {
        let new_likes = post.likes + req.body.like;

        const user = await User.findById(req.session.user);
        if (req.body.like === 1) {
          if (user.likedposts.includes(id)) {
            return;
          }
          user.likedposts.push(id);
        } else {
          if (!user.likedposts.includes(id)) {
            return;
          }
          user.likedposts.splice(user.likedposts.indexOf(id), 1);
        }
        post.likes = new_likes;
        const u = await user.save();
        result = await post.save();
        const posts = await Post.find();
        res.send({ post: result, user: u, posts: posts });
      }
    }
  } catch (error) {
    log(error);
    res.status(500).send("Internal Server Error"); // server error
  }
});

/*************************************************/
// webpage routes for production build (heroku)

app.use(express.static(path.join(__dirname, "/workout/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "workout/build/index.html"));
});

/*************************************************/
// Express server listening...
const port = process.env.PORT || 5000;
app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
