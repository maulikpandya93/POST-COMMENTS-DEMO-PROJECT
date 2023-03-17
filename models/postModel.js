const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db_connect');
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


// post.sync({force : true})

module.exports = post;