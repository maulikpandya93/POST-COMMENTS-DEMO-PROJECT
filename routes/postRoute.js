const express = require('express');
const { createPost, showAllPosts, getPostById, editPost, deletePost, showUsersAllPosts } = require('../controllers/postController');
const {validatePost} = require("../middlewares/postCheck")
const { isAuth } = require('../middlewares/isAuth');
const router = express.Router();


router
.route("/")
.get(isAuth(['user','admin']), showAllPosts)
.post(isAuth(['user','admin']), validatePost,createPost)

router
.route("/postbyid/:id")
.get(isAuth(['user','admin']), getPostById)
.put(isAuth(['user','admin']), validatePost, editPost)
.delete(isAuth(['user','admin']), deletePost)

router
.route("/myAllPosts")
.get(isAuth(['user','admin']), showUsersAllPosts)

module.exports = router;