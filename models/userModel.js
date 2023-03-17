const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db_connect");
const  post  = require("./postModel");

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

User.hasMany(post,{
    foreignKey : 'user_id',
    as : 'postDetails'
})

post.belongsTo(User, {
    foreignKey : "user_id",
    as : 'userDetails'
})

// User.sync({force : true})

module.exports = User;