/* User model */
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  userID: {
    type: String,
  },
  comment: {
    type: String,
  },
});

const PicturePostSchema = new Schema({
  picture: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const PostSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  filters: [String],
  thumbnail: {
    type: String,
    require: true,
  },
  likes: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  picture_content: [ PicturePostSchema ],
  blog_content: {
    type: String,
  },
  video_content: {
    type: String,
  },
  comment_list: [CommentSchema],
  datecreated: {
    type: Date,
  },
  creator: {
    type: String,
    required: true,
  }
});

const Post = mongoose.model("posts", PostSchema);
module.exports = { Post };
