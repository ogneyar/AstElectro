// printStroyka


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

    let weight = one["Вес, кг"] || one["Масса нетто, кг"]

    let length = one["Длина, м"]
    let width = one["Ширина, м"]
    let height =one["Транспортная высота, м"] || one["Высота в сложенном состоянии, мм"]

    if (one["Габариты, мм"] && ! (length || width || height)) {
        let gabarites = one["Габариты, мм"].replace(/х/g, "x").split("x") // замена русской "х" на ихний "x"
        length = gabarites[0]
        width = gabarites[1]
        height = gabarites[2]
    }

    let brandName = one["Бренд"]

    let country = ""

    if (category) {
        category = category.split(",")[0]
        category = category.replace(">", "/")
        let idx = category.indexOf(">")
        if (idx !== -1) category = category.slice(0, idx)
    }
            
    let categoryId = 0
    
    if (category && category !== "Строительное оборудование") { 

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
            let cat = await createCategory(category, translit_category, 1, 12) // 12 = "stroitelnoe-oborudovanie_too"

            categoryId = cat.id
        }

    }else {
        categoryId = 269 // 269 = "stroitelnoe-oborudovanie_drugoe"
    }

    // let brand = await Brand.findOne({ where: { name: "Advanta" } })
    let brandId = 12 // brand.id
    if ( ! brandId ) throw "Не найден бренд товара!"
    
    let product = await findProductByArticle(article)
    
    if (product && product.id !== undefined) throw "Такой товар уже есть."
    
    
    let info = []
    
    let size
    
    if (weight || length || width || height) {
        let volume = ""
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
            && i !== "Excerpt"
        ) {
            if (characteristics) characteristics += ";"
            characteristics += i + ";" + one[i].replace(/;/g, ".")
        }
    })
    
    if (characteristics) info.push( { title: "characteristics", body: characteristics } )

    if (one["Excerpt"]) info.push( { title: "description", body: one["Excerpt"].replace(/\n/g, "<br/>").replace(/;/g, ".") } )

    
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