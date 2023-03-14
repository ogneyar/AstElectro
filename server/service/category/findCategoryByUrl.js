const { Category } = require('../../models/models')

async function findCategoryByUrl(url) {

    let category
    try {
        category = await Category.findOne({
            where: { url }
        })
    }catch(e) {
        return false
    }
    
    if (category) return category
    
    return false

}
    
module.exports = findCategoryByUrl