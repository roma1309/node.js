const {Sequelize} = require('sequelize')

module.exports = new Sequelize( 'test_node', 
'root',
'13092001',  {
    dialect: 'mysql',
    host: 'localhost'
  });