const commentModel = require("../models/commentModel");
const postModel = require('../models/postModel');

exports.createComment = async (req, res) => {

    try {
        const { post_id } = req.query;
        const { comment } = req.body;
        // console.log(post_id); 
        const createdComment = await commentModel.create({
            comment: comment,
            post_id: +post_id,
            user_id: req.user.id
        })
        const findPost = await postModel.findOne({ where: { id: post_id } })
        if (findPost) {
            if (createdComment) {
                res.status(200).json({
                    message: 'Comment Added!',
                    comment: createdComment
                })
            } else {
                res.status(404).json({
                    message: 'Bad Request!',
                    error: 'Comment Not Created'
                })
            }
        } else {
            res.status(404).json({
                message: 'Bad Request!',
                eror: `POST NOT FOUND WITH GIVEN ID!`
            })
        }

    } catch (error) {
        res.status(404).json({
            message: 'Bad Request',
            error: 'Something Went Wrong'
        })
    }
}


exports.editComment = async (req, res) => {
    const { comment_id, post_id } = req.query;
    const role = req.user.role;
    // console.log(role);
    const findPost = await postModel.findOne({ where: { id: post_id } })
    if (findPost) {
        const findComment = await commentModel.findOne({ where: { id: comment_id } })
        if (findComment) {
            if (role == 'ADMIN') {
                const updateComment = await commentModel.update(req.body, {
                    where: {
                        id: comment_id
                    }
                })
                if (updateComment) {
                    const findUpdatedComment = await commentModel.findOne({ where: { id: comment_id } })
                    res.status(200).json({
                        message: 'Comment Updated Successfully!',
                        updatedComment: findUpdatedComment
                    })
                } else {
                    res.status(404).json({
                        message: 'Bad Request!',
                        error: 'Comment Not Updated'
                    })
                }
            }

            if (role == 'USER') {
                // console.log('aaya');
                if (req.user.id == findComment.user_id) {
                    const updateComment = await commentModel.update(req.body, {
                        where: {
                            id: comment_id
                        }
                    })
                    if (updateComment) {
                        const findComment = await commentModel.findOne({ where: { id: comment_id } })
                        res.status(200).json({
                            message: 'Comment Updated Successfully!',
                            updatedComment: findComment
                        })
                    } else {
                        res.status(404).json({
                            message: 'Bad Request!',
                            error: 'Comment not updated'
                        })
                    }
                } else {
                    res.status(404).json({
                        message: 'Bad Request!',
                        error: 'Only admin and user who created comment can edit comments'
                    })
                }
            }
        } else {
            res.status(404).json({
                message: 'Bad Request!',
                error: 'Comment Not Found With Given Id'
            })
        }
    } else {
        res.status(404).json({
            error: 'Bad Request',
            message: 'Post with given id not found!'
        })
    }



}


exports.deleteComment = async (req, res) => {

    const { comment_id, post_id } = req.query;
    const role = req.user.role;
    const findPost = await postModel.findOne({ where: { id: post_id } })
    if (findPost) {

        const findComment = await commentModel.findOne({ where: { id: comment_id } })
        if (findComment) {
            if (role == 'ADMIN') {
                findComment.isDleted = true;
                findComment.deletedBy = role;
                findComment.deletedAt = new Date();
                const findComment = await commentModel.findOne({ where: { id: comment_id } })
                res.status(200).json({
                    message : 'Comment Deleted Successfully!',
                    deletedComment : findComment
                })
            }
            if (role == 'USER') {
                if (req.user.id == findComment.user_id || req.user.id == findComment.post_id) {
                    findComment.isDeleted = true;
                    findComment.deletedBy = role;
                    findComment.deletedAt = new Date();
                    res.status(200).json({
                        message: 'Commente Deleted Successfully!',
                        deletedComment: findComment
                    })
                } else {
                    res.status(404).json({
                        error: 'Bad Request',
                        message: 'Only user who uploaded post, user who commented and admin can delete comment!'
                    })
                }
            }
        }else{
            res.status(404).json({
                error : 'Bad Request',
                message : 'Commented Already Deleted!'
            })
        }
    } else {
        res.status(404).json({
            error: 'Bad Request',
            message: 'Post with given id not found!'
        })
    }
}