
const { Category } = require('../../models/models')
const findCategoryByUrl = require('./findCategoryByUrl')

// except - номер категории в БД, до которой все предыдущие считаются старыми категориями
async function createCategory(name, url, is_product, sub_category_id, except = "") {
    
    const oldCategory = await findCategoryByUrl(url)
    if (oldCategory) {
        if ( ! except || oldCategory.id >= except) return oldCategory
        url += "_too"
    }

    console.log(" ");
    console.log("url",url);
    console.log(" ");

    const category = await Category.create({name, url, is_product, sub_category_id})

    
    return category
}


module.exports = createCategory