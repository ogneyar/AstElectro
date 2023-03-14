const { Product } = require('../../models/models')

async function findProductByArticle(article) {

    let product
    try {
        product = await Product.findOne({
            where: { article }
        })
    }catch(e) {
        return false
    }
    
    if (product) return product
    
    return false

}
    
module.exports = findProductByArticle