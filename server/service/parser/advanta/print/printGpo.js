
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
    let description = one["Описание"]

    let brutto = one["Масса брутто, кг"]
    let netto = one["Масса нетто, кг"]
    let weight = one["Вес, кг"] || brutto || netto

    let length = one["Длина, м"]
    let width = one["Ширина, м"]
    let gabarits = one["Габариты, мм"]
    let packageL = one["Размеры упаковки, мм"]

    let brandName = one["Бренд"]
    let model = one["Модель"]

    let country = one["Страна-производитель"] || "Китай"

    if (category) {
        category = category.split(",")[0]
        category = category.replace(">", "/")
        let idx = category.indexOf(">")
        if (idx !== -1) category = category.slice(0, idx)
    }
    
    let categoryId = 0
    
    if (category && category !== "Грузоподъемное оборудование") { 

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
        let cat = await createCategory(category, translit_category, 1, 807) // 807 = "gruzopodemnoe-oborudovanie"

        categoryId = cat.id
        }

    }else {
        categoryId = 808 // category = "gruzopodemnoe-oborudovanie_prochee"
    }

    // let brand = await Brand.findOne({ where: { name: "Advanta" } })
    let brandId = 12 // brand.id
    if ( ! brandId ) throw "Не найден бренд товара!"
    
    let product = await findProductByArticle(article)
    
    if (product && product.id !== undefined) throw "Такой товар уже есть."
    
    
    let info = []
    
    let size
    if (packageL) {
        let pack = packageL.split("*")
        size = {
            weight,
            length: pack[0],
            width: pack[1],
            height: pack[2],
            volume: ((pack[0] * pack[1] * pack[2]) / 1e9).toFixed(4)
        }
    }else if (gabarits) {
        let gab = gabarits.replace(/х/g, "x").split("x") // замена русской "х" на ихний "x"
        size = {
            weight,
            length: gab[0],
            width: gab[1],
            height: gab[2],
            volume: ((gab[0] * gab[1] * gab[2]) / 1e9).toFixed(4)
        }
    }else {
        if (weight || length || width) {
            size = {
                weight,
                length,
                width,
                height: "",
                volume: ""
            }
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
            && i !== "Описание"
            && i !== "Размеры упаковки, мм"
            && i !== "Габариты, мм"
            && i !== "Наличие"
        ) {
            // response[`${i}`] = one[i]
            if (characteristics) characteristics += ";"
            characteristics += i + ";" + one[i].replace(/;/g, ".")
        }
    })
    
    if (characteristics) info.push( { title: "characteristics", body: characteristics } )
    if (description) info.push( { title: "description", body: description.replace(/;/g, ".") } )

    
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