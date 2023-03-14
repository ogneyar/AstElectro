const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING, defaultValue: null}
})

module.exports = Token