const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db_connect");
const { post } = require("../models/postModel");

const User = sequelize.define('users', {
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password: {
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
    role : {
        type : DataTypes.STRING,
        defaultValue : 'USER',
        allowNull : false
    }
});


User.sync({force : false})

module.exports = User;