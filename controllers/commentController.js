const commentModel = require("../models/commentModel");

exports.createComment = async (req, res) => {
    

    const {comment} = req.body;
    // console.log(comment);
    const createdComment = await commentModel.create({
        comment : comment
    })

    if(createdComment){
        res.status(200).json({
            message : 'Comment Added!',
            comment : createdComment
        })
    }else{
        res.status(404).json({
            message : 'Bad Request!',
            error : 'Comment Not Created'
        })
    }

}