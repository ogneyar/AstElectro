const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, // идентификатор
    name: {type: DataTypes.STRING, allowNull: false}, // наименование
    url: {type: DataTypes.STRING, defaultValue: null}, // ссылка на товар
    price: {type: DataTypes.DECIMAL, allowNull: false}, // цена
    rating: {type: DataTypes.FLOAT, defaultValue: 0}, // рейтинг
    img: {type: DataTypes.STRING(1024), allowNull: false}, // массив ссылок на изображения
    have: {type: DataTypes.INTEGER, defaultValue: 0}, // имеется ли товар в наличии
    article: {type: DataTypes.STRING, defaultValue: null}, // артикул
    promo: {type: DataTypes.STRING, defaultValue: null}, // название акции, если товар учавствует
    country: {type: DataTypes.STRING, defaultValue: null}, // страна производитель
    request: {type: DataTypes.TINYINT, defaultValue: false} // цена по запросу (если true, то вместо цены появляется кнопка "Запросить цену")
})

module.exports = Product