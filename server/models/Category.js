const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    url: {type: DataTypes.STRING, defaultValue: null},
    is_product: {type: DataTypes.TINYINT, defaultValue: 0},
    sub_category_id: {type: DataTypes.INTEGER, defaultValue: 0} // в какой категории находится (0 - категория верхнего уровня)
})

module.exports = Category