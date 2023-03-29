const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const CategoryInfo = sequelize.define('category_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING(4096), defaultValue: null},
    characteristics: {type: DataTypes.STRING(4096), defaultValue: null},
    documents: {type: DataTypes.STRING(4096), defaultValue: null},
    image: {type: DataTypes.STRING, defaultValue: null},
})

module.exports = CategoryInfo