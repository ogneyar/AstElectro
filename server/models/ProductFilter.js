
const sequelize = require('../db')
const { DataTypes } = require('sequelize')


const ProductFilter = sequelize.define('product_filter', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false}
})

module.exports = ProductFilter