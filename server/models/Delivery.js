const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const Delivery = sequelize.define('delivery', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: null}, // sdek, pr, pek, dl, bb
    uuid: {type: DataTypes.STRING, defaultValue: null}
})

module.exports = Delivery