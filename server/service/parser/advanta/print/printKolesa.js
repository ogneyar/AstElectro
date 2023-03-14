// printKolesa


const { Category } = require('../../../../models/models')
const createCategory = require('../../../category/createCategory')
const findProductByArticle = require('../../../product/findProductByArticle')
const translit = require('../../../translit.js')
const getFiles = require('./getFiles')


module.exports = async (one) => {

    let id = one["id"]
    let articleOld = one["Артикул"]
    let article = "adv000" + id
    let name = one["Название товара"].replace(/(  )/g," ")
    let url = translit(name) + "_" + article
    let price = 0
    let category = one["Категории товаров"]
    let have = one["Наличие"]
    let image = one["Картинка"]

    let weight = one["Общий вес, г"]
    if (weight) weight /= 1000

    let length = one["Диаметр колеса, мм"]
    let width = one["Диаметр колеса, мм"]
    let height = one["Ширина обода, мм"]
    if (one["Ширина ступицы, мм"] && height < one["Ширина ступицы, мм"]) height = one["Ширина ступицы, мм"]

    let brandName = one["Бренд"]

    let country = one["Страна-производитель"] || "Китай"

    if (category) {
        category = category.split(",")[0]
        category = category.replace(">", "/")
        let idx = category.indexOf(">")
        if (idx !== -1) category = category.slice(0, idx)
    }
            
    let categoryId = 0
    
    if (category && category !== "Колесные опоры") { 

        let index = category.indexOf("/")
        category = category.slice(index + 1, category.length)

        let translit_category = translit(category)

        let cat = await Category.findAll()
        cat.forEach(i => {
            if (i.url === translit_category) {
                categoryId = i.id
            }
        })
        
        if (categoryId === 0) {
            // throw "Не найден номер категории!"
        let cat = await createCategory(category, translit_category, 1, 811) // 811 = "kolesnye-opory"

        categoryId = cat.id
        }

    }else {
        categoryId = 812 // category = "prochie"
    }

    // let brand = await Brand.findOne({ where: { name: "Advanta" } })
    let brandId = 12 // brand.id
    if ( ! brandId ) throw "Не найден бренд товара!"
    
    let product = await findProductByArticle(article)
    
    if (product && product.id !== undefined) throw "Такой товар уже есть."
    
    
    let info = []
    
    let size
    
    if (weight || length || width || height) {
        let volume
        if (length && width && height) volume = ((length * width * height) / 1e9).toFixed(4)
        size = {
            weight,
            length,
            width,
            height,
            volume
        }
    }

    
    let characteristics = ""
    let keys = Object.keys(one)

    keys.forEach(i => {
        if (one[i] !== "" 
            && i !== "id"
            && i !== "Название товара"
            && i !== "Артикул"
            && i !== "Наличие"
            && i !== "Картинка"
            && i !== "Категории товаров"
            && i !== "Наличие"
        ) {
            if (characteristics) characteristics += ";"
            characteristics += i + ";" + one[i].replace(/;/g, ".")
        }
    })
    
    if (characteristics) info.push( { title: "characteristics", body: characteristics } )

    
    let files = await getFiles(image, article)


    return {
        categoryId,
        brandId,
        article, 
        name,
        url,
        have: 1,
        promo: "",
        country,
        files,
        price,
        size,
        info
    }

}