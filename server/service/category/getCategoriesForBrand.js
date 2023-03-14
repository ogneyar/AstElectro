// getCategoriesForBrand

const Brand = require("../../models/Brand")
const Category = require("../../models/Category")
const Product = require("../../models/Product")


const getCategoriesForBrand = async (brand) => {
    let tmk
    if (brand === "redverg" || brand === "concorde" || brand === "kvalitet" ) {
        tmk = brand === "kvalitet" ? "квалитет" : brand
        brand = "TMK"
    }

    let brands = await Brand.findOne({
        where: {name: brand}
    })
    let brandId = brands.id
    let products = await Product.findAll({
        where: { brandId, have: 1 }
    })

    if (tmk) {
        products = products.filter(item => item.name.toLowerCase().includes(tmk))
    }

    let arrayCategories = products.map(i => i.categoryId)
    arrayCategories = [ ... new Set(arrayCategories) ]

    let allCategories = await Category.findAll()

    let arraySelectedCategory = []

    const recursiveFunction = (id) => {
        allCategories.forEach(item => {
            if (item.id === id) {
                arraySelectedCategory.push(id)
                recursiveFunction(item.sub_category_id)
            }
        })
    }

    arrayCategories.forEach(id => recursiveFunction(id))

    arraySelectedCategory = [ ... new Set(arraySelectedCategory) ]

    let response = await Category.findAll({
        where: {
            id: arraySelectedCategory
        }
    })

    return response
}


module.exports = getCategoriesForBrand