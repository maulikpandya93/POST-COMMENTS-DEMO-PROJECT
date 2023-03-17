const express = require('express');
const { createPost, showAllPosts, getPostById, editPost, deletePost, showUsersAllPosts } = require('../controllers/postController');
const {validatePost} = require("../middlewares/postCheck")
const { isAuth } = require('../middlewares/isAuth');
const router = express.Router();


router
.route("/")
.get(isAuth(['USER','ADMIN']), showAllPosts)
.post(isAuth(['USER','ADMIN']), validatePost,createPost)

router
.route("/postbyid/:id")
.get(isAuth(['USER','ADMIN']), getPostById)
.put(isAuth(['USER','ADMIN']), validatePost, editPost)
.delete(isAuth(['USER','ADMIN']), deletePost)

router
.route("/myAllPosts")
.get(isAuth(['USER','ADMIN']), showUsersAllPosts)

module.exports = router;