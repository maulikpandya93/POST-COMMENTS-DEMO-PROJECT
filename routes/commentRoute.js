const express = require('express');
const { createComment, editComment, deleteComment } = require('../controllers/commentController');
const { validateComment } = require('../middlewares/commentCheck');
const { isAuth } = require('../middlewares/isAuth');
const router = express.Router();

router
.route("/")
.get((req, res) => {
    res.send('COMMENT PAGE!')
})
.post(isAuth(['USER','ADMIN']), validateComment, createComment)
.put(isAuth(['USER','ADMIN']), validateComment, editComment)
.delete(isAuth(['USER','ADMIN']), deleteComment)

module.exports = router;