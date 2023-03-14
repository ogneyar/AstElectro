
let { Op, literal } = require('sequelize')

const { Product, SortProduct, Category } = require("../../models/models")
const getCategoryArrays = require('../category/getCategoryArrays')


async function getAll({ brandId, categoryId, limit, page, mix_all, mix_no_img, mix_promo, filter }) {
    
    page = Number(page) || 1
    limit = Number(limit) || 12
    brandId = brandId && Number(brandId)

    if (categoryId && ! Array.isArray(categoryId)) {
        let category = await Category.findOne({
            where: {
                id: categoryId
            }
        })
        categoryId = await getCategoryArrays(category.url)
    }

    let products = {}
    
    let offset = page * limit - limit
    
    let columnName
    if (mix_all && mix_no_img && mix_promo && mix_all !== "false" && mix_no_img !== "false" && mix_promo !== "false") columnName = "mix_all_and_mix_no_img_with_promo"
    else if (mix_all && mix_all !== "false" && mix_promo && mix_promo !== "false") columnName = "mix_all_with_promo"
    else if (mix_no_img && mix_no_img !== "false" && mix_promo && mix_promo !== "false") columnName = "mix_no_img_with_promo"
    else if (mix_promo && mix_promo !== "false") columnName = "mix_promo"
    else if (mix_all && mix_no_img && mix_all !== "false" && mix_no_img !== "false") columnName = "mix_all_and_mix_no_img"
    else if (mix_all && mix_all !== "false") columnName = "mix_all"
    else if (mix_no_img && mix_no_img !== "false") columnName = "mix_no_img"
    else columnName = "productId"

    if (limit === -1) {
        products = await Product.findAll({ where: { have: 1 }})
    }else {
        let array = [] // массив id товаров
        //--------------------------------
        if (!brandId && !categoryId) {            
        //     products.count = await Product.count({ where: { have: 1 } })

        //     let sort_products = await SortProduct.findAll({})            
        //     for (let idx = offset; idx < offset + limit; idx++) {
        //         if (idx >= products.count) break
        //         if (sort_products[idx]) 
        //             array.push(sort_products[idx][`${columnName}`]) // создаём массив id товаров
        //     } 

            products = await Product.findAndCountAll({ where: { have: 1 }})

        }else {
            let where
            //--------------------------------
            if (brandId && !categoryId) {
                where = { brandId, have: 1 } 
            }else
            //--------------------------------
            if (!brandId && categoryId) {
                where = { categoryId, have: 1 } 
            }else
            //--------------------------------
            if (brandId && categoryId) {
                where = { brandId, categoryId, have: 1 } 
            }

            products = await Product.findAndCountAll({ where })
            
            // let sort_products = await SortProduct.findAll({
            //     where: { 
            //         productId: products.rows.map(i => i.id)
            //     },
            //     order: [ 
            //         [ columnName, 'ASC' ], 
            //     ]
            // })           

            // for (let idx = offset; idx < offset + limit; idx++) {
            //     if (idx >= products.count) break
            //     if (sort_products[idx]) 
            //         array.push(sort_products[idx].productId) // создаём массив id товаров
            // }
        }
        
        // products.rows = await Product.findAll({
        //     where: { 
        //         id: { [Op.in]: array }
        //     },
        //     order: literal("FIELD(product.id," + array.join(',') + ")")
        // })

    }

    return products
}

module.exports = getAll
