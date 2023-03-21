const postModel = require("../models/postModel")
const comment = require("../models/commentModel");


exports.createPost = async (req, res) => {

    try {
        const { title, caption } = req.body;
        // console.log(req.user);
        const createdPost = await postModel.create({
            title: title,
            caption: caption,
            user_id: req.user.id
        })
        if (createdPost) {
            console.log('POST CREATED!');
            res.status(200).json({
                message: 'POST CREATED SUCCESSFULLY',
                post: createdPost
            })
        } else {
            console.log('POST NOT CREATED');
            res.status(404).json({
                message: 'Bad Request',
                error: 'Post Not Created'
            })
        }
    }catch (error) {
        res.status(404).json({
            message: 'Something Went Wrong!'
        })
    }
} 

exports.editPost = async (req, res) => {

    try {
        const id = req.params.id;
        const { role } = req.user
        // const role = req.user.role
        const found = await postModel.findOne({ where: { id: id } })
        if (found) {
            if (role == 'admin') {
                const updatedPost = await postModel.update(req.body, {
                    where: { id: id }
                })
                if (updatedPost) {
                    const findUpdatedPost = await postModel.findOne({ where: { id: id } })
                    res.status(200).json({
                        message: "POST UPDATED SUCCESSFULLY",
                        updatedPost: findUpdatedPost
                    })
                } else {
                    res.status(404).json({
                        message: 'POST NOT UPDATED'
                    })
                }
            }
            if (role == 'user') {
                console.log(found);
                if (found.user_id == req.user.id) {

                    const updatedPost = await postModel.update(req.body, {
                        where: { id: id }
                    })
                    if (updatedPost) {
                        const findUpdatedPost = await postModel.findOne({ where: { id: id } })
                        res.status(200).json({
                            message: "POST UPDATED SUCCESSFULLY",
                            updatedPost: findUpdatedPost
                        })
                    } else {
                        res.status(404).json({
                            message: 'POST NOT UPDATED'
                        })
                    }
                } else {
                    res.status(404).json({
                        message: 'Bad Request',
                        error: `USER CAN'T EDIT ANOTHER USER'S POST`
                    })
                }
            }
        } else {
            res.status(404).json({
                message: 'Bad Request',
                error: 'POST NOT FOUND WITH GIVEN ID'
            })
        }
    } catch (error) {
        // console.log(error);
        res.status(404).json({
            message: 'Bad Request',
            error: 'Something Went Wrong!'
        })
    }

}

exports.deletePost = async (req, res) => {

    try {
        const { role, id } = req.user;
        const post_id = req.params.id
        const foundPost = await postModel.findOne({
            where: {
                id: post_id
            },
            include: [{
                model: comment, as: 'commentDetails',
                attributes: {
                    exclude: [
                        'createdAt', 'updatedAt'
                    ]
                }
            }]
        })
        if (foundPost) {
            if (role == 'admin') {
                if (foundPost.isDeleted == 1) {
                    res.status(404).json({
                        message: 'Bad Request',
                        error: 'Post is already deleted!'
                    })
                } else {
                    const deletePost = await postModel.update({
                        isDeleted : true,
                        deletedAt : new Date(),
                        deletedBy : role   
                    }, {
                        where: {id : post_id}
                    })
                    
                    const deleteComment = await comment.update({
                        isDeleted : true,
                        deletedAt : new Date(),
                        deletedBy : role
                    }, {
                        where : {post_id : post_id}
                    })

                    const deletedPost = await postModel.findOne({where : {id : post_id}})
                    res.status(200).json({
                        message: 'POST DELETED SUCESSFULLY',
                        deletedPost : deletedPost
                    })
                }
            }
            if (role == 'user') {
                if (foundPost.user_id == id) {

                    if (foundPost.isDeleted == 1) {
                        res.status(404).json({
                            message: 'Bad Request',
                            error: 'Post is already deleted!'
                        })
                    } else {
                        const deletePost = await postModel.update({
                            isDeleted : true,
                            deletedAt : new Date(),
                            deletedBy : role   
                        }, {
                            where: {id : post_id}
                        })
                        
                        const deleteComment = await comment.update({
                            isDeleted : true,
                            deletedAt : new Date(),
                            deletedBy : role
                        }, {
                            where : {post_id : post_id}
                        })
    
                        const deletedPost = await postModel.findOne({where : {id : post_id}})
                        res.status(200).json({
                            message: 'POST DELETED SUCESSFULLY',
                            deletedPost : deletedPost
                        })
                    }
                } else {
                    res.status(404).json({
                        message: `USER CAN'T DELETE ANOTHER USER'S POST!`
                    })
                }
            }
        } else {
            res.status(404).json({
                message: 'Bad Request',
                error: 'Post not found with given id'
            })
        }
    } catch (error) {
        res.status(404).json({
            message: 'SOMETHING WENT WRONG!'
        })
    }
}

exports.showAllPosts = async (req, res) => {
    try {
        const allData = await postModel.findAll({
            where: {
                isDeleted: false
            },
            include: [{
                model: comment, as: 'commentDetails',
                attributes: {
                    exclude: [
                        'createdAt', 'updatedAt', 'isDeleted', 'deletedBy', 'deletedAt'
                    ]
                }
            }],
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt', 'isDeleted', 'deletedBy', 'deletedAt', 'user_id'
                ]
            }
        });
        if (allData.length == 0) {
            return res.status(404).json({
                message: 'Bad Request',
                error: 'NO DATA AVAILABLE'
            })
        }
        if (allData) {
            return res.status(200).json(allData)
        }
    } catch (error) {
        res.status(300).json({
            error: '404',
            message: "Bad Request"
        })
    }
}

exports.showUsersAllPosts = async (req, res) => {
    try {
        const allData = await postModel.findAll({
            where: {
                user_id: req.user.id,
                isDeleted: false
            },
            include: [{
                model: comment, as: 'commentDetails',
                where : {
                    isDeleted : false
                },
                required : false,
                attributes: {
                    exclude: [
                        'createdAt', 'updatedAt', 'isDeleted', 'deletedBy', 'deletedAt'
                    ]
                }
            }],
            attributes: {
                exclude: [
                    'createdAt', 'updatedAt', 'isDeleted', 'deletedBy', 'deletedAt', 'user_id'
                ]
            }
        });
        if (allData.length == 0) {
            res.status(404).json({
                message: 'Bad Request',
                error: 'USER HAS NOT CREATED ANY POST!'
            })
        }
        if (allData) {
            res.status(200).json(allData)
        }
    } catch (error) {
        res.status(300).json({
            message: "Bad Request",
            error: `Can't get users all posts!`
        })
    }
}

exports.getPostById = async (req, res) => {
    try {
        const id = req.params.id;
        const found = await postModel.findOne({
            where: {
                id: id
            },
            include: [{
                model: comment, as: 'commentDetails',
                where : {
                    isDeleted : false
                },
                required : false,
                attributes: {
                    exclude: [
                        'createdAt', 'updatedAt', 'isDeleted', 'deletedBy', 'deletedAt'
                    ]
                }
            }]
        })
        // console.log(found);
        if (found) {
            if (found.isDeleted == 1) {
                res.status(404).json({
                    message: 'Bad Request',
                    error: 'Post with given id is deleted!'
                })
            } else {
                res.status(200).json(found)
            }
        } else {
            console.log(found);
            res.status(404).json({
                message: 'Bad Request',
                error: 'NO POST WITH GIVEN ID'
            })
        }
    } catch (error) {
        res.status(404).json({
            message: 'Bad Request',
            error: 'SOMETHING WENT WRONG!'
        })
    }
}




