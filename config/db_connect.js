const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('mynewdb', 'root', 'root', {
    dialect : 'mysql',
    host : 'localhost',
    logging : false
})

sequelize.sync({force : true});
module.exports = {sequelize}
