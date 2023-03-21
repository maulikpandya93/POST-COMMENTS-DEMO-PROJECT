const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db_connect');
const comment = require('./commentModel');
const User = require('./userModel')

const post = sequelize.define('posts',{
    title : {
        type : DataTypes.STRING,
        allowNull : false
    }, 
    caption : {
        type : DataTypes.STRING,
        allowNull : false
    },
    isDeleted : {
        type : DataTypes.BOOLEAN,
        defaultValue : false 
    },
    deletedBy : {
        type : DataTypes.STRING,    
        defaultValue : ""
    },
    deletedAt : {
        type : DataTypes.DATE,
        defaultValue : null
    },
    user_id : {
        type : DataTypes.INTEGER
    }
});


post.hasMany(comment, {
    foreignKey : 'post_id',
    as : 'commentDetails'
})

comment.belongsTo(post, {
    foreignKey : 'post_id',
    as : 'postDetails'
})

module.exports = post;