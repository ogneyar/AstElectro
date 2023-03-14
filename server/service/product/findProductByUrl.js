const { Product } = require('../../models/models')

async function findProductByUrl(url) {

    let product
    try {
        product = await Product.findOne({
            where: { url }
        })
    }catch(e) {
        return false
    }
    
    if (product) return product
    
    return false

}
    
module.exports = findProductByUrl