
const Math = require('mathjs')

const findProductByArticle = require('../../product/findProductByArticle')
const translit = require('../../translit.js')
const getHtml = require('../../html/getHtml')
const Category = require('../../../models/Category')
const Product = require('../../../models/Product')
// vseInstrumenti
const searchVI = require('./vseInstrumenti/search')
const getFiles = require('./vseInstrumenti/getFiles')
const getDescription = require('./vseInstrumenti/getDescription')
const getCharacteristics = require('./vseInstrumenti/getCharacteristics')
const getEquipment = require('./vseInstrumenti/getEquipment')
const getSizes = require('./vseInstrumenti/getSizes')
// euroboorRus
const searchERU = require('./euroboorRus/search')
const getDescriptionERU = require('./euroboorRus/getDescription')
const getFilesERU = require('./euroboorRus/getFiles')


module.exports = async (one, kursEuro) => {
    
    let article = one.article
    let name = one.name + " (" + article + ")"
    let url = translit(name) //+ "_" + article.replace("/", "_")
    let priceEuro = one.price
    let price = Math.round( (priceEuro * kursEuro) * 100 ) /100
    let categoryUrl = one.category
    let category = await Category.findOne({ where: { url: categoryUrl } })    
    let categoryId = category.id || null
    // return { categoryUrl, category, categoryId }
    let have = true
    
    let country = "Нидерланды" || "Китай"

    // let brand = await Brand.findOne({ where: { name: "Euroboor" } })
    let brandId = 4 // brand.id
    if ( ! brandId ) throw "Не найден бренд товара!"
    
    let myArticle = "erb" + article.replace("/", "_").replace(" ", "_")
    let product = await findProductByArticle(myArticle)
    
    if (product && product.id !== undefined) {
        if ( ! product.categoryId ) {
            await Product.update({ categoryId }, { where: { id: product.id }})
                .then(() => {
                    throw `Артикул ${myArticle} - данные о категории обновлены.`
                })
        }else {
            throw "Такой товар уже есть."
        }
    }    
    
    let URI, html
    let info = [], size, files
    let description, characteristics, equipment

    try {
        // поиск на VseInstrumenti.ru
        URI = await searchVI(article)

        html = await getHtml(URI)

        try {
            description = await getDescription(html)
        }catch(e) { }
        
        try {
            characteristics = await getCharacteristics(html)
        }catch(e) { }
        
        try {
            equipment = await getEquipment(html)
        }catch(e) { }
        
        try {
            size = await getSizes(html)
        }catch(e) { }
        
        files = await getFiles(html, myArticle)

    }catch(e) {
        console.log(`\r\n${e}\r\n`)
        URI = await searchERU(article)
        // throw e

        html = await getHtml(URI)
        // return {html}
        
        try {
            description = await getDescriptionERU(html)
        }catch(e) { }
        
        files = await getFilesERU(html, myArticle)
    }
    
    if (description) info.push( { title: "description", body: description } )
    if (characteristics) info.push( { title: "characteristics", body: characteristics } )
    if (equipment) info.push( { title: "equipment", body: equipment } )


    return {
        // category,
        categoryId,
        brandId,
        article: myArticle, 
        name,
        url,
        // URI,
        have,
        promo: "",
        country,
        files,
        price,
        size,
        info
    }

}