const express = require('express');
const { createComment } = require('../controllers/commentController');
const { validateComment } = require('../middlewares/commentCheck');
const { isAuth } = require('../middlewares/isAuth');
const router = express.Router();

router
.route("/")
.get((req, res) => {
    res.send('COMMENT PAGE!')
})
.post(isAuth, validateComment, createComment)

module.exports = router;