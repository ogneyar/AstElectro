
const User = require('./User')
const Cart = require('./Cart')
const Product = require('./Product')
const Category = require('./Category')
const Brand = require('./Brand')
const Rating = require('./Rating')
const ProductInfo = require('./ProductInfo')
const ProductSize = require('./ProductSize')
const ProductFilter = require('./ProductFilter')
const Token = require('./Token')
const Delivery = require('./Delivery')
const Order = require('./Order')
const SortProduct = require('./SortProduct')


User.hasOne(Cart)
Cart.belongsTo(User)

User.hasMany(Rating)
Rating.belongsTo(User)

Category.hasMany(Product)
Product.belongsTo(Category)

Brand.hasMany(Product)
Product.belongsTo(Brand)

Product.hasMany(Rating)
Rating.belongsTo(Product)

Product.hasMany(ProductInfo, {as: 'info'})
ProductInfo.belongsTo(Product)

Product.hasMany(ProductSize, {as: 'size'})
ProductSize.belongsTo(Product)

Product.hasMany(ProductFilter, {as: 'filter'})
ProductFilter.belongsTo(Product)

User.hasMany(Token)
Token.belongsTo(User)

User.hasMany(Delivery)
Delivery.belongsTo(User)

Product.hasOne(SortProduct)
SortProduct.belongsTo(Product)


module.exports = {
    User,
    Cart,
    Product,
    Category,
    Brand,
    Rating,
    ProductInfo,
    ProductSize,
    ProductFilter,
    Token,
    Delivery,
    Order,
    SortProduct
}
