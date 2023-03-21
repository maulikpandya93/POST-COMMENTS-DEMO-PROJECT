const express = require('express');
const { createComment, editComment, deleteComment, getCommentById } = require('../controllers/commentController');
const { validateComment } = require('../middlewares/commentCheck');
const { isAuth } = require('../middlewares/isAuth');
const router = express.Router();

router
.route("/")
.get((req, res) => {
    res.send('COMMENT PAGE!')
})
.post(isAuth(['user','admin']), validateComment, createComment)
.put(isAuth(['user','admin']), validateComment, editComment)
.delete(isAuth(['user','admin']), deleteComment)

router
.route("/getCommentById")
.get(isAuth(['user','admin']), getCommentById)

module.exports = router;