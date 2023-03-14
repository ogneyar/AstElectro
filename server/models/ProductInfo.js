const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const ProductInfo = sequelize.define('product_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    body: {type: DataTypes.STRING(4096), allowNull: false}
})

module.exports = ProductInfo