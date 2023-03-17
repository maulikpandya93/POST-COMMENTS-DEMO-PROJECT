const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('mynewdb', 'root', 'root', {
    dialect : 'mysql',
    host : 'localhost',
    logging : false
})

module.exports = {sequelize}
