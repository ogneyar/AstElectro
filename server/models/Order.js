const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    uuid: {type: DataTypes.STRING, allowNull: false},
    cart: {type: DataTypes.STRING(1024), allowNull: false},
    delivery: {type: DataTypes.STRING, defaultValue: "pickup"},
    address: {type: DataTypes.STRING, allowNull: true},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    state: {type: DataTypes.STRING, defaultValue: "forming"}, // forming, confirmed, onway, delivered, taken (сформирован, подтверждён, в пути, доставлен, получен)
    pay: {type: DataTypes.TINYINT, defaultValue: false},
    client: {type: DataTypes.INTEGER, defaultValue: null},
    email: {type: DataTypes.STRING, defaultValue: null},
    phone: {type: DataTypes.BIGINT, defaultValue: null},
    name: {type: DataTypes.STRING, defaultValue: null},
    trackNumber: {type: DataTypes.STRING, defaultValue: null},
})

module.exports = Order