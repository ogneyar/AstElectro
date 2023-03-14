//
const Math = require('mathjs')
const fs = require('fs')
const path = require('path')
const { Brand, Category, Product } = require('../../../models/models')
const { Op } = require('sequelize')
const createProduct = require('../../product/createProduct.js')
const parseXml = require('../../xml/parseXml')
const ProductDto = require('../../../dtos/productDto')
const createCategoriesForTor = require('./createCategoriesForTor')
const printOne = require('./printOne')
const saveInfoInFile = require('../../saveInfoInFile')
// const printOne = require('./printOne')



module.exports = class Tor {
    
    static categories = []
    static product = []
    
    constructor() {}

    async run(args = {}) { 
        
        let { feed, create_categories } = args

        let fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'tor', 'feed.xml')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'tor'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'tor'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'tor', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 

            let { shop } = await parseXml(fullPath)//, arrayColumnName)
            
            // this.product = shop.offers["ДетальнаяЗапись"]
            if (shop && Array.isArray(shop.offers["ДетальнаяЗапись"])) {
                this.product = shop.offers["ДетальнаяЗапись"].map(i => {

                    let article, code, price, name, id, pageUrl, image, description, descriptionMore, brand
                    let weight, length, height, width, imageMore, characteristics, categoryName

                    id = i["ID"]._text
                    name = i["Наименование"]._text
                    article = i["Артикул"]._text
                    price = i["Цена"]._text
                    code = i["Кодраздела"]._text
                    categoryName = i["Названиераздела"]._text
                    pageUrl = i["DETAIL_PAGE_URL"]._text
                    image = i["Основноеизображение"]._text
                    description = i["ПодробноеОписание"]._text
                    descriptionMore = i["ДополнительноеОписаниеНоменклатуры"]._text
                    if (!description && descriptionMore) description = descriptionMore
                    brand = i["ПроизводительКод"]._text
                    weight = i["Вес"]._text
                    length = i["Длина"]._text
                    height = i["Высота"]._text
                    width = i["Ширина"]._text
                    if (i["Дополнительныеизображения"] && i["Дополнительныеизображения"]["Изображение"] && i["Дополнительныеизображения"]["Изображение"]["URL"]) imageMore = i["Дополнительныеизображения"]["Изображение"]["URL"]._text
                    if (i["Характеристики"] && i["Характеристики"]["Характеристика"] && Array.isArray(i["Характеристики"]["Характеристика"])) {
                        characteristics = i["Характеристики"]["Характеристика"].map(i => {
                            if ( ! length && i["Название"]._text === "Глубина упаковки, мм") length = i["Значение"]._text
                            if ( ! height && i["Название"]._text === "Высота упаковки, мм") height = i["Значение"]._text
                            if ( ! width && i["Название"]._text === "Ширина упаковки, мм") width = i["Значение"]._text
                            return i["Название"]._text.replace(/;/g, ".") + ";" + i["Значение"]._text.replace(/;/g, ".")
                        }).join(";")
                    }

                    return {
                        // id,
                        name,
                        article,
                        price,
                        code,
                        categoryName,
                        // pageUrl,
                        image,
                        description,
                        // descriptionMore,
                        // brand,
                        weight,
                        length,
                        height,
                        width,
                        // imageMore,
                        characteristics
                    }

                })
                // return true
            }
            
            // this.categories = shop["Разделы"]["Раздел"]
            if (create_categories) this.categories = await createCategoriesForTor(shop["Разделы"]["Раздел"])
            
            return true

        }else {
            throw `Файл ${fullPath} отсутствует или пуст!`
        }

        return false
    }


    // количество записей в feed.xml
    async getLength() { 
        return this.product.length
    }


    // вывод данных на экран
    async print(number) {

        let one = this.product[number - 1]
        // return one

        let response = await printOne(one)

        return response
        // return new ProductDto(response)

    }

    // добавление товара в БД
    async add(number) { 
        // return "add"
        try {
            let print = await this.print(number)

            let proDto = new ProductDto(print)
        
            let product = await createProduct(proDto)
            
            let response = `{${number}: ${product.url} - ${product.price}р. (${product.article})}`
            console.log('\x1b[34m%s\x1b[0m', response)

            return response
        }catch(e) {
            let response = `{${number}: `
            if (typeof(e) === "string") response += `${e.replace("<","&lt;").replace(">","&gt;")}`
            else response += JSON.stringify(e)
            // response += ` (error)}`
            console.log('\x1b[33m%s\x1b[0m', response)
            return response
        }
    }

    
    // добавление партии товара в БД
    async addParty(number, quantity) {
        // return "addParty"
        if (quantity === 1) return await this.add(number)
        
        let array = []

        for(let i = number; i < number+quantity; i++) {
            let response = await this.add(i)
            array.push(response)
        }
        
        return array
    }


    // смена цен
    async changePrice() {
        let response = `{<br />`
        
        let brand = await Brand.findOne({ where: { name: "Tor" } })
        if (brand.id === undefined) return { error: "Не найден бренд товара." }

        let old = await Product.findAll({ where: { brandId: brand.id } })

        if (this.product !== undefined) {
            
            this.product.forEach(newProduct => {
            
                if (newProduct.name == "" || newProduct.price == "") { // если пустая строка
                    // continue // пропусти
                }else {

                let myArticle = "tor" + newProduct.article

                let newPrice = Math.round( newProduct.price * 100 ) /100

                if (response !== `{<br />`) response += ",<br />"
                let yes = false
                old.forEach(oldProduct => {
                    if (oldProduct.article === myArticle) {
                        
                        if (newPrice != oldProduct.price) {
                            response += `"${oldProduct.article}": "Старая цена: ${oldProduct.price}, новая цена: ${newPrice}"`
                            Product.update({ price: newPrice },
                                { where: { id: oldProduct.id } }
                            ).then(()=>{}).catch(()=>{})
                        }else {
                            response += `"${oldProduct.article}": "Цена осталась прежняя = ${oldProduct.price}"`
                        }
                        yes = true

                    }
                })
                if ( ! yes) response += `"${myArticle}": "Не найден артикул."`
                
                }
            })
        }

        response = response + `<br />}`
        
        saveInfoInFile(brand.name, "update_price", response) 

        return response
    }


}

