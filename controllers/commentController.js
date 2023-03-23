const commentModel = require("../models/commentModel");
const postModel = require('../models/postModel');

exports.createComment = async (req, res) => {

    try {
        const { post_id } = req.query;
        const { comment } = req.body;
        const createdComment = await commentModel.create({
            comment: comment,
            post_id: +post_id,
            user_id: req.user.id,
        })
        const findPost = await postModel.findOne({ where: { id: post_id } })
        if (findPost) {
            if(findPost.isDeleted == true) {
                res.status(404).json({
                    error : '404',
                    message : 'No post found!'
                })
            }
            if (createdComment) {
                res.status(200).json({
                    message: 'Comment Added!',
                    comment: createdComment
                })
            } else {
                res.status(400).json({
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
        res.status(400).json({
            message: 'Bad Request',
            error: 'Something Went Wrong'
        })
    }
}


exports.editComment = async (req, res) => {
    try {
        const { comment_id, post_id } = req.query;

        if (!post_id) res.status(400).json({ message: 'Porvide Post Id also!!' })

        const role = req.user.role;
        
        const findPost = await postModel.findOne({ where: { id: post_id,
            isDeleted : false } })
        if (findPost) {
            const findComment = await commentModel.findOne({ where: { id: comment_id,
                isDeleted : false } })
            if (findComment && findComment.isDeleted == false) {
                if (role == 'admin') {
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
                        res.status(400).json({
                            message: 'Bad Request!',
                            error: 'Comment Not Updated'
                        })
                    }
                }

                if (role == 'user') {
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
                            res.status(400).json({
                                message: 'Bad Request!',
                                error: 'Comment not updated'
                            })
                        }
                    } else {
                        res.status(401).json({
                            message: 'Unauthorized!',
                            error: 'Only admin and user who created comment can edit comments'
                        })
                    }
                }
            } else {
                res.status(404).json({
                    message: 'Not Found!',
                    error: 'Comment Not Found With Given Id'
                })
            }
        } else {
            res.status(404).json({
                error: 'Not Found',
                message: 'Post with given id not found!'
            })
        }
    } catch (error) {
        res.status(400).json({
            error: '400',
            message: 'Something went wrong!'
        })
    }
}


exports.deleteComment = async (req, res) => {
    try {
        const { comment_id, post_id } = req.query;
        const role = req.user.role;
        const findPost = await postModel.findOne({ where: { id: post_id,
        isDeleted : false } })
        if (findPost) {
            const findComment = await commentModel.findOne({ where: { id: comment_id,
                isDeleted : false } })
            if (findComment) {
                if (role == 'admin') {
                    findComment.isDeleted = true;
                    findComment.deletedBy = role;
                    findComment.deletedAt = new Date();
                    await findComment.save();
                    res.status(200).json({
                        message: 'Comment Deleted Successfully!',
                        deletedComment: findComment
                    })
                }
                if (role == 'user') {
                    if (req.user.id == findComment.user_id || req.user.id == findPost.user_id) {
                        findComment.isDeleted = true;
                        findComment.deletedBy = role;
                        findComment.deletedAt = new Date();
                        await findComment.save();
                        res.status(200).json({
                            message: 'Commente Deleted Successfully!',
                            deletedComment: findComment
                        })
                    } else {
                        res.status(401).json({
                            error: 'Unauthprized',
                            message: 'Only user who uploaded post, user who commented and admin can delete comment!'
                        })
                    }
                }
            } else {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Commented Already Deleted!'
                })
            }
        } else {
            res.status(404).json({
                error: 'Not Found',
                message: 'Post with given id not found!'
            })
        }
    } catch (error) {
        res.status(400).json({
            error: '400',
            message: 'Bad Request!'
        })
    }
}


exports.getCommentById = async (req, res) => {

    try {
        const { comment_id, post_id } = req.query;
        const findPost = await postModel.findOne({ where: { id: post_id, isDeleted : false } })
        if (findPost) {
            const findComment = await commentModel.findOne({ where: { 
                id: comment_id,
                post_id : post_id,
                isDeleted : false
             } })
            if (findComment) {
                res.status(200).json({
                    message: 'Found Comment!',
                    comment: findComment
                })
            } else {
                res.status(400).json({
                    error: 'Bad Request!',
                    message: 'No Comment With Given Id On Post'
                })
            }
        }else{
            res.status(404).json({
                error : 'Not Found!',
                message : 'Post Not Found'
            })
        }
    } catch (error) {
        res.status(400).json({
            error : '400',
            message : 'Something Went Wrong!'
        })
    }
}