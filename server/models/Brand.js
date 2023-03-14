const sequelize = require('../db')
const { DataTypes } = require('sequelize')


const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

module.exports = Brand