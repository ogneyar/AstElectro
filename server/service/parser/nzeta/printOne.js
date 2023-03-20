
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
let sharp = require('sharp')
const { Op } = require('sequelize')
const { Brand, Category, Product } = require('../../../models/models')
const findProductByArticle = require('../../product/findProductByArticle')
const createFoldersAndDeleteOldFiles = require('../../createFoldersAndDeleteOldFiles.js')
const translit = require('../../translit.js')


async function printOne(one) {
    
    if (one.name.toLowerCase().includes("krause")) throw "Это товар Krause, их добавляем отдельно."

    let brand = "tor"

    let category = await Category.findOne({
        where: { 
            name: one.categoryName,
            id: {
                [Op.gte]: 839 // gte - >=
            }
        }
    })

    let url = translit(one.name)
    let have = true
    let promo = ""
    let country = "Китай" || "Россия"

    // let brand = await Brand.findOne({ where: { name: "Tor" } })
    let brandId = 13 // brand.id
    if ( ! brandId ) throw "Не найден бренд товара!"

    let myArticle = "tor" + one.article
    let product = await findProductByArticle(myArticle)

    if (product && product.id !== undefined) throw "Такой товар уже есть."
    
    let info = []
    if (one.description) info.push( { title: "description", body: one.description } )
    if (one.characteristics) info.push( { title: "characteristics", body: one.characteristics } )
    
    let size
    let volume = 0
    if (one.length && one.height && one.width) {
        volume = (one.length * one.width * one.height / 1e9).toFixed(4) // 1e9 = 10 ** 9 = 1 000 000 000 
    }
    size = { 
        weight: one.weight || 0, 
        length: one.length || 0, 
        width: one.width || 0, 
        height: one.height || 0, 
        volume
    }

    
    createFoldersAndDeleteOldFiles(brand, myArticle)
    
    let imageName = "1.jpg"

    let files = `[`

    let bigFile = path.resolve(__dirname, '..', '..', '..', 'static', brand, myArticle, 'big', imageName)
    let smallFile = path.resolve(__dirname, '..', '..', '..', 'static', brand, myArticle, 'small', imageName)

    let imageBig = fs.createWriteStream(bigFile)
    let imageSmall = fs.createWriteStream(smallFile)
    
    https.get(one.image, (res) => {
        res.pipe(imageBig)
        res.pipe(sharp().resize(100).on('error', err => { console.error(err) })).pipe(imageSmall)
    }).on('error', (e) => { console.error(e) })
    
    files += `{"big":"${brand}/${myArticle}/big/${imageName}","small":"${brand}/${myArticle}/small/${imageName}"}`
    
    files += `]`
    
    
    return { 
        ...one,
        categoryId: category.id,
        article: myArticle,
        url,
        have,
        country,
        brandId,
        promo,
        info,
        size,
        files
    } 

}

module.exports = printOne