const fs = require('fs')
const path = require('path')
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
const saveInfoInFile = require('../../saveInfoInFile')
const parseJson = require('../../json/parseJson')


module.exports = class KVT {
    
    static product = []
    static price = []
    static priceJson = [] 

    
    constructor() {
    }

    async run(feed = {}) {
        let fullPath, response

        fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'kvt', 'feed.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 
            
            response = await parseXlsx(fullPath, [
                "раздел",
                "подраздел",
                "код товара (SKU)",
                "обозначение",
                "наименование",
                "назначение, применение",
                "цвет",
                "страна происхождения",
                "единица измерения",
                "формат потребительской упаковки",
                "количество в потребительской упаковке",
                "тип потребительской упаковки",
                "длина потребительской упаковки, см",
                "ширина потребительской упаковки, см",
                "высота потребительской упаковки, см", 
                "вес брутто потребительской упаковки, кг",
                "объём потребительской упаковки, куб.м",
                "гарантийный срок эксплуатации (лет)",
                "технические характеристики",
                "онлайн-карточка товара",
                "код ТНВЭД",
                "сертификация",
                "основное изображение",
                "изображение товарной позиции",
                "чертеж",
            ])
            
            if (response && Array.isArray(response)) {
                this.product = response.map(i => {
                    return {
                        category: i["раздел"],
                        sub_category: i["подраздел"],
                        article: i["код товара (SKU)"],
                        name: i["наименование"] + " " + i["обозначение"],
                        description: i["назначение, применение"],
                        color: i["цвет"],
                        country: i["страна происхождения"],
                        measure_unit: i["единица измерения"],
                        format_package: i["формат потребительской упаковки"],
                        quantity: i["количество в потребительской упаковке"],
                        type_package: i["тип потребительской упаковки"],
                        length: i["длина потребительской упаковки, см"],
                        width: i["ширина потребительской упаковки, см"],
                        height: i["высота потребительской упаковки, см"],
                        weight: i["вес брутто потребительской упаковки, кг"],
                        volume: i["объём потребительской упаковки, куб.м"],
                        warranty: i["гарантийный срок эксплуатации (лет)"],
                        characteristics: i["технические характеристики"],
                        link: i["онлайн-карточка товара"],
                        nomenclature: i["код ТНВЭД"],
                        certificate: i["сертификация"],
                        main_image: i["основное изображение"],
                        image: i["изображение товарной позиции"],
                        plan: i["чертеж"],
                    }
                })
                return true
            }

        }else {
            throw `Файл ${fullPath} отсутствует или пуст!`
        }

        return false
    }

    // прайс для заведения товаров
    async run_price(feed = {}) {
        let fullPath, response

        fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'kvt', 'price.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 
            
            response = await parseXlsx(fullPath, [
                "Код товара",
                "Наименование",
                "РРЦ",
                "Упаковка",
            ])
            
            if (response && Array.isArray(response)) {
                this.price = response.map(i => {
                    return {
                        article: i["Код товара"],
                        name: i["Наименование"],
                        price: i["РРЦ"],
                        quantity: i["Упаковка"],
                    }
                })
                return true
            }

        }else {
            throw `Файл ${fullPath} отсутствует или пуст!`
        }

        return false
    }

    // прайс для обновления цен
    async run_price_json(feed = {}) {

        let fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'kvt', 'price.json')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kvt', feed.name)
            await feed.mv(fullPath)
        }
            
        this.priceJson = await parseJson(fullPath)

        if (this.priceJson.error !== undefined) return this.priceJson.error 

        return true
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
        let one_price
        this.price.forEach(i => {
            if (i.article === article) one_price = i.price 
        })

        if ( ! one_price ) return { error: "Не найдена цена товара." }

        let sub_category = one.sub_category
        let category = one.category

        let cat = await Category.findAll() //{ where: { name: sub_category} })
        let id = [], categoryId = 0
        cat.forEach(i => {
            if (i.name.toLowerCase() === sub_category.toLowerCase()) {
                id.push( { id: i.id, sub_category_id: i.sub_category_id } )
            }
        })
        if (id.length > 1) {
            id.forEach(j => {
                cat.forEach(i => {
                    if (j.sub_category_id === i.id) {
                        if (i.name.toLowerCase() === category.toLowerCase()) {
                            categoryId = j.id
                        }
                    }
                    
                })
            })
        }else {
            categoryId = id[0].id
        }

        if (categoryId === 0) return { error: "Не найдена категория товара." }

        let brand = await Brand.findOne({ where: { name: "KVT" } })
        
        if (brand.id === undefined) return { error: "Не найден бренд товара." }

        article = "kvt" + article

        // console.log("article",article)

        let name = one.name
        if (one.color) name += ` ${one.color}`
        if (one.quantity > 1) name += ` (${one.quantity} ${one.measure_unit})`
        
        let url = translit(name) + "_" + article

        let product = await Product.findOne({ where: { url } })

        if (product && product.id !== undefined) return { error: "Такой товар уже есть." }

        let country = one.country

        let price = one_price * one.quantity

        let image = one.image

        if ( ! image || image === "—" ) image = one.main_image

        createFoldersAndDeleteOldFiles("kvt", article)

        let imageName = uuid.v4() + '.jpg'

        let imageBig = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'kvt', article, 'big', imageName))
        let imageSmall = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'kvt', article, 'small', imageName))

        https.get(image, (res) => {
            res.pipe(imageBig)
            res.pipe(sharp().resize(100)).pipe(imageSmall)
        })

        let files = `[`

        files += `{"big":"kvt/${article}/big/${imageName}","small":"kvt/${article}/small/${imageName}"}`
        
        let plan = one.plan
        
        if (plan && plan !== "—") {
            let planName = uuid.v4() + '.jpg'

            let planBig = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'kvt', article, 'big', planName))
            let planSmall = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'kvt', article, 'small', planName))
    
            https.get(plan, (res) => {
                res.pipe(sharp()).pipe(planBig)
                res.pipe(sharp().resize(100)).pipe(planSmall)
            })

            files += `,{"big":"kvt/${article}/big/${planName}","small":"kvt/${article}/small/${planName}"}`
        }

        files += `]`
        

        let size = { 
            weight: one.weight,
            width: one.width * 10, // переводим сантиметры в миллиметры
            height: one.height * 10, // переводим сантиметры в миллиметры
            length: one.length * 10, // переводим сантиметры в миллиметры
            volume: one.volume 
        }

        let info = []
        if (one.description) {
            let description = "<p>" + one.description + "</p>"
            info.push( { title: "description", body: description } )
        }
        if (one.characteristics) {
            let arrayCharacteristics = one.characteristics.split("\n")

            // console.log("typeof(arrayCharacteristics)",typeof(arrayCharacteristics))
            // console.log("arrayCharacteristics",arrayCharacteristics)

            let characteristics = "<tbody>" + arrayCharacteristics.map(i => {
                let data = i.split(": ")

                return `<tr><td>${data[0]}</td><td>${data[1]}</td></tr>`
            }).join('')// + "</tbody>"
            
            let year = "лет"
            if (one.warranty === 1 || one.warranty === 21 || one.warranty === 31) year = "год"
            if ((one.warranty > 1 && one.warranty < 5) || (one.warranty > 21 && one.warranty < 25) || (one.warranty > 31 && one.warranty < 35)) year = "года"

            characteristics += `<tr><td>Единицы измерения</td><td>${one.measure_unit}</td></tr>`
            characteristics += `<tr><td>Количество</td><td>${one.quantity}</td></tr>`
            characteristics += `<tr><td>Гарантия</td><td>${one.warranty} ${year}</td></tr>`
            characteristics += `<tr><td>Страна</td><td>${one.country}</td></tr>`
            characteristics += "</tbody>"

            info.push( { title: "characteristics",body: characteristics } )
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
            filter: undefined,
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

                    // let { name, url, price, have, article, promo, country, brandId, categoryId, files, info, size, filter } = print
            
                    let proDto = new ProductDto(print)

                    let response = await createProduct(proDto)
                
                    array.push(`{${i}: ${response.url} - ${response.price}}р.`)
                    continue

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
            
                let response = await createProduct(name, url, price, have, article, promo, country, brandId, categoryId, files, info, size, filter)
                
                return `{${number}: ${response.url} - ${response.price}р.}`
            }catch(e) {
                return `{${number}: ${e}}`
            }
        }
    }

    // смена цен
    async changePrice(json = true) {
        let response = `{<br />`
        
        let brand = await Brand.findOne({ where: { name: "KVT" } })
        if (brand.id === undefined) return { error: "Не найден бренд товара." }

        let products = await Product.findAll({ where: { brandId: brand.id } })

        this.priceJson.forEach(newProduct => {
            if (newProduct.error) return
            if (response !== `{<br />`) response += ",<br />"
            let yes = false
            products.forEach(oldProduct => {
                if (oldProduct.article === `kvt${newProduct.article}`) {
                    let newPrice = newProduct.price * newProduct.quantity
                    newPrice = Math.round(newPrice * 100) / 100
                    if (newPrice != oldProduct.price) {
                        response += `"kvt${newProduct.article}": "Старая цена = ${oldProduct.price}, новая цена = ${newPrice}."`
                        Product.update({ price: newPrice },
                            { where: { id: oldProduct.id } }
                        ).then(()=>{}).catch(()=>{})
                    }else {
                        response += `"kvt${newProduct.article}": "Цена осталась прежняя = ${oldProduct.price}."`
                    }
                    yes = true
                }
            })
            if ( ! yes) response += `"kvt${newProduct.article}": "Не найден артикул."`
        })
        response = response + `<br />}`

        saveInfoInFile(brand.name, "update_price", response) 

        return response
    }


}