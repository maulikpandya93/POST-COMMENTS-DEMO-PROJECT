const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db_connect');

const comment = sequelize.define('comments', {
    comment : {
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
    post_id : {
        type : DataTypes.INTEGER
    },
    user_id : {
        type : DataTypes.INTEGER
    }
})

module.exports = comment