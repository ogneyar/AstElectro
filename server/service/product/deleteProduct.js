
const { Product, ProductInfo, ProductSize, ProductFilter } = require('../../models/models');
const deleteOldFiles = require('../deleteOldFiles');
const findProductByArticle = require('./findProductByArticle')


async function deleteProduct(brand, article) {
    
    const product = await findProductByArticle(article) 
    if (product) {
        try {
            await ProductInfo.destroy({
                where: {productId: product.id}
            })
        } catch (e) {
            console.log(`Не смог удалить ProductInfo у артикула ${article}.`);
        }
        try {
            await ProductSize.destroy({
                where: {productId: product.id}
            })
        } catch (e) {
            console.log(`Не смог удалить ProductSize у артикула ${article}.`);
        }
        try {
            await ProductFilter.destroy({
                where: {productId: product.id}
            })
        } catch (e) {
            console.log(`Не смог удалить ProductFilter у артикула ${article}.`);
        }
        try {
            await Product.destroy({
                where: {article}
            })
        } catch (e) {
            console.log(`Не смог удалить Product с артикулом ${article}.`);
        }
        
    }

    // console.log(" ");
    // console.log("article",article);
    // console.log(" ");

    deleteOldFiles(brand, article)

    
    return true
}


module.exports = deleteProduct