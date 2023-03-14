const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const Cart = sequelize.define('cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING(1024), allowNull: false}
})

module.exports = Cart