const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const ProductSize = sequelize.define('product_size', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    weight: {type: DataTypes.FLOAT, allowNull: false},
    volume: {type: DataTypes.FLOAT, allowNull: false},
    width: {type: DataTypes.FLOAT, allowNull: false},
    height: {type: DataTypes.FLOAT, allowNull: false},
    length: {type: DataTypes.FLOAT, allowNull: false}
})

module.exports = ProductSize