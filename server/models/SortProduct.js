const sequelize = require('../db')
const { DataTypes } = require('sequelize')


const SortProduct = sequelize.define('sort_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, // идентификатор
    mix_all: {type: DataTypes.INTEGER, allowNull: false}, // идентификатор товара
    mix_no_img: {type: DataTypes.INTEGER, allowNull: false}, // идентификатор товара
    mix_all_and_mix_no_img: {type: DataTypes.INTEGER, allowNull: false}, // идентификатор товара
    mix_promo: {type: DataTypes.INTEGER, allowNull: true}, // идентификатор товара
    mix_all_with_promo: {type: DataTypes.INTEGER, allowNull: false}, // идентификатор товара
    mix_no_img_with_promo: {type: DataTypes.INTEGER, allowNull: false}, // идентификатор товара
    mix_all_and_mix_no_img_with_promo: {type: DataTypes.INTEGER, allowNull: false}, // идентификатор товара
})

module.exports = SortProduct