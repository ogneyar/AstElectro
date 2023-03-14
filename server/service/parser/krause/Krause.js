
const fs = require('fs')
const path = require('path')
const http = require('https')
const https = require('https')
const uuid = require('uuid')
const Math = require('mathjs')

let sharp = require('sharp')

const { Brand, Category, Product } = require('../../../models/models')

const createFoldersAndDeleteOldFiles = require('../../createFoldersAndDeleteOldFiles.js')
const createProduct = require('../../product/createProduct.js')
const translit = require('../../translit.js')

const parseXlsx = require('../../xlsx/parseXlsx')
const ProductDto = require('../../../dtos/productDto')
const getImages = require('./getImages')
const saveInfoInFile = require('../../saveInfoInFile')


module.exports = class Krause {
    
    static product = []
    static price = []

    
    constructor() {
    }

    async run(feed = {}) {
        let fullPath, response

        fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'krause', 'feed.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'krause'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'krause'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'krause', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 
            
            response = await parseXlsx(fullPath, [
                "Код_товара",
                "Название_позиции",
                "Поисковые_запросы",
                "Описание",
                "Ссылка_изображения",
                "Адрес_подраздела",
                "Страна_производитель",
                "Название_Характеристики",
                "Измерение_Характеристики",
                "Значение_Характеристики",
            ])
            
            if (response && Array.isArray(response)) {
                this.product = response.map(i => {
                    return {
                        article: i["Код_товара"],
                        name: i["Название_позиции"],
                        search_requests: i["Поисковые_запросы"],
                        description: i["Описание"],
                        image: i["Ссылка_изображения"],
                        category: i["Адрес_подраздела"],
                        country: i["Страна_производитель"],
                        name_char: i["Название_Характеристики"],
                        measure_char: i["Измерение_Характеристики"],
                        value_char: i["Значение_Характеристики"],
                    }
                })
                return true
            }

        }else {
            throw `Файл ${fullPath} отсутствует или пуст!`
        }

        return false
    }

    async run_price(feed = {}) {
        let fullPath, response

        fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'krause', 'price.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'krause'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'krause'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'krause', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 
            
            response = await parseXlsx(fullPath, [
                "Артикул",
                "Наименование",
                "МРЦ",
            ])
            
            if (response && Array.isArray(response)) {
                this.price = response.map(i => {
                    return {
                        article: i["Артикул"],
                        name: i["Наименование"],
                        price: i["МРЦ"],
                    }
                })
                return true
            }

        }else {
            throw `Файл ${fullPath} отсутствует или пуст!`
        }

        return false
    }

    // количество записей в feed.xlsx
    async getLength() {
        return this.product.length
    }

    // количество записей в price.xlsx
    async getLengthPrice() {
        return this.price.length
    }

    // вывод данных на экран
    async print(number) {
        let one = this.product[number - 1]

        let article = one.article
        let price
        this.price.forEach(i => {
            if (i.article === article) price = i.price 
        })

        if ( ! price ) return { error: "Не найдена цена товара." }

        let category = await Category.findOne({ where: { url: one.category} })
        let categoryId = category.id

        if (!categoryId || categoryId === 0) return { error: "Не найдена категория товара." }

        let brand = await Brand.findOne({ where: { name: "Krause" } })
        
        if (brand.id === undefined) return { error: "Не найден бренд товара." }
        
        // let image = one.image // ссыки https://images.ru.prom.st не работают
        let images = await getImages(article) // достаём с сайта https://www.krause-systems.ru

        article = "krs" + article

        let name = one.name
        let url = translit(name) + "_" + article
        let product = await Product.findOne({ where: { url } })
        if (product && product.id !== undefined) return { error: "Такой товар уже есть." }

        let country = one.country
        
        
        let files = `[`

        createFoldersAndDeleteOldFiles("krause", article)

        for (let i = 0; i < images.length; i++) {
            
            let imageName = i + 1 +'.jpg'
            let imageBig = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'krause', article, 'big', imageName))
            let imageSmall = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'krause', article, 'small', imageName))

            https.get(images[i], (res) => {
                res.pipe(imageBig)
                res.pipe(sharp().resize(100)).pipe(imageSmall)
            })
			
			if (files !== `[`) files += `,`
            files += `{"big":"krause/${article}/big/${imageName}","small":"krause/${article}/small/${imageName}"}`
        }

        files += `]`

        let info = []
        if (one.description) {
            let description
            if (one.description.includes("<p>")) description = one.description
            else description = "<p>" + one.description + "</p>"
            description = description.replace(/\r\n/g, "")
            info.push( { title: "description", body: description } )
        }
        let characteristics = ""
        if (one.name_char) { // если есть массив данных
            for (let i = 0; i < one.name_char.length; i++) {
                if (one.name_char[i]) { // если есть запись в массиве
                    if (characteristics) characteristics += ";"
                    characteristics += one.name_char[i]
                    if (one.measure_char[i]) characteristics += ", " + one.measure_char[i]
                    characteristics += ";" + one.value_char[i]
                }
            }
            info.push( { title: "characteristics",body: characteristics } )
        }
        let size = {}
        if (characteristics) {
            one.name_char.forEach((char, idx) => {
                if (char.toLowerCase().trim() === "транспортные габариты") {
                    let split
                    if (one.value_char[idx].includes("x")) split = one.value_char[idx].split("x")      // ангийский x прописной
                    else if (one.value_char[idx].includes("X")) split = one.value_char[idx].split("X") // ангийский X заглавный
                    else if (one.value_char[idx].includes("х")) split = one.value_char[idx].split("х") // русская х прописная
                    else split = one.value_char[idx].split("Х")                                        // русская Х заглавная
                    if (split.length > 1) {
                        let length = split[0].trim()
                        let width = split[1].trim()
                        let height = split[2].trim()
                        let volume = (length*width*height).toFixed(4)
                        size = { 
                            ...size,
                            width: width * 1000,  // переводим метры в миллиметры
                            height: height * 1000, 
                            length: length * 1000, 
                            volume 
                        }
                    }
                }else if (char.toLowerCase().trim() === "вес") {
                    let weight = one.value_char[idx].trim()
                    size = { 
                        ...size,
                        weight
                    }
                }
            })
        }
        
        
        return { 
            categoryId,
            brandId: brand.id, 
            article, 
            name,
            url,
            have: 1, 
            promo: "",
            country,
            files,
            price,
            size,
            info,
            filter: undefined
        }
    }

    // добавление товара в БД
    async add(number, quantity) {

        if (quantity) {
            let array = []
            for(let i = number; i < number+quantity; i++) {
                try {
                    let print = await this.print(i)
                    if (print.error !== undefined) {
                        array.push(`{${i}: ${print.error}}`)
                        continue
                    }
                    let proDto = new ProductDto(print)
                    // создание записи
                    let response = await createProduct(proDto)
                    array.push(`{${i}: ${response.url} - ${response.price}}р.`)
                }catch(e) {
                    array.push(`{${i}: ${e}}`)
                }
            }
            
            return array

        }else {
            try {
                let print = await this.print(number)
                if (print.error !== undefined) return `{${number}: ${print.error}}`
                let { name, url, price, have, article, promo, country, brandId, categoryId, files, info, size, filter } = print
                // создание записи
                let response = await createProduct(name, url, price, have, article, promo, country, brandId, categoryId, files, info, size, filter)

                return `{${number}: ${response.url} - ${response.price}р.}`
            }catch(e) {
                return `{${number}: ${e}}`
            }
        }
    }

    // смена цен
    async changePrice() {
        let response = `{<br />`
        
        let brand = await Brand.findOne({ where: { name: "Krause" } })
        if (brand.id === undefined) return { error: "Не найден бренд товара." }

        let products = await Product.findAll({ where: { brandId: brand.id } })

        this.price.forEach(newProduct => {
            if (response !== `{<br />`) response += ",<br />"
            let yes = false
            products.forEach(oldProduct => {
                if (oldProduct.article === `krs${newProduct.article}`) {
                    let newPrice = newProduct.price
                    newPrice = Math.round(newPrice * 100) / 100
                    if (newPrice != oldProduct.price) {
                        response += `"krs${newProduct.article}": "Старая цена = ${oldProduct.price}, новая цена = ${newPrice}.`
                        Product.update({ price: newPrice },
                            { where: { id: oldProduct.id } }
                        ).then(()=>{}).catch(()=>{})
                    }else {
                        response += `"krs${newProduct.article}": "Цена осталась прежняя = ${oldProduct.price}."`
                    }
                    yes = true
                }
            })
            if ( ! yes) response += `"krs${newProduct.article}": "Не найден артикул."`
        })
        response = response + `<br />}`

        saveInfoInFile(brand.name, "update_price", response)

        return response
    }


}
