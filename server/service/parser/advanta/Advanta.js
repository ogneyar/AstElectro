//
const fs = require('fs')
const path = require('path')
const { Brand, Category, Product } = require('../../../models/models')
const createProduct = require('../../product/createProduct.js')
const parseXlsx = require('../../xlsx/parseXlsx')
const ProductDto = require('../../../dtos/productDto')
const getArrayColumnName = require('./getArrayColumnName')
const printGpo = require('./print/printGpo')
const printKolesa = require('./print/printKolesa')
const printSklad = require('./print/printSklad')
const printStroyka = require('./print/printStroyka')



module.exports = class Advanta {
    
    static product = []
    static chapter = ""
    
    constructor() {}

    async run(args = {}) { 
        // if ( ! args ) args = {}
        let { feed, chapter } = args
            
        // chapter = "gpo" || "kolesa" || "sklad" || "stroyka"
        if ( ! chapter ) throw `Не передан chapter, наименование раздела!`
        this.chapter = chapter

        let fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'advanta', this.chapter + '.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'advanta'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'advanta'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'advanta', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 

            let arrayColumnName = getArrayColumnName(this.chapter)

            if ( ! arrayColumnName ) throw `Не передан arrayColumnName, массив наименований столбцов!`

            let response = await parseXlsx(fullPath, arrayColumnName)
            
            if (response && Array.isArray(response)) {
                this.product = response

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


    // вывод данных на экран
    async print(number) {

        let one = this.product[number - 1]
        // return one

        let response
        if (this.chapter === "gpo") response = await printGpo(one)
        if (this.chapter === "kolesa") response = await printKolesa(one)
        if (this.chapter === "sklad") response = await printSklad(one)
        if (this.chapter === "stroyka") response = await printStroyka(one)

        return response 
        // return new ProductDto(response)

    }

    // добавление товара в БД
    async add(number) {
        try {
            let print = await this.print(number)

            // let { name, url, price, have, article, promo, country, brandId, categoryId, files, info, size, filter, request } = print

            let proDto = new ProductDto(print)
        
            let product = await createProduct(proDto)
            
            let response = `{${number}: ${product.url} - ${product.price}р. (${product.article})}`
            console.log('\x1b[34m%s\x1b[0m', response)

            return response
        }catch(e) {
            let response = `{${number}: `
            if (typeof(e) === "string") response += `${e.replace("<","&lt;").replace(">","&gt;")}`
            response += ` (error)}`
            console.log('\x1b[33m%s\x1b[0m', response)
            return response
        }
    }

    
    // добавление партии товара в БД
    async addParty(number, quantity) {

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
        let response = `[`
        
        // let brand = await Brand.findOne({ where: { name: "Gedore" } })
        // if (brand.id === undefined) return { error: "Не найден бренд товара." }

        // let old = await Product.findAll({ where: { brandId: brand.id } })

        // if (this.product !== undefined) this.product.forEach(newProduct => {
        //     if (response !== `[`) response += ",<br />"
        //     let yes = false
        //     old.forEach(oldProduct => {
        //         if (oldProduct.article === `ged${newProduct.article}`) {
        //             let newPrice = newProduct.price
        //             newPrice = Math.round(newPrice * 100) / 100
        //             if (newPrice != oldProduct.price) {
        //                response += `{${oldProduct.article} - Старая цена: ${oldProduct.price}, Новая цена: ${newPrice}}`
        //                 Product.update({ price: newPrice },
        //                     { where: { id: oldProduct.id } }
        //                 ).then(()=>{}).catch(()=>{})
        //             }else {
        //                 response += `{${oldProduct.article} - Цена осталась прежняя: ${oldProduct.price}}`
        //             }
        //             yes = true
        //         }
        //     })
        //     if ( ! yes) response += `{Не найден артикул: ged${newProduct.article}}`
        // })

        response = response + `]`

        return response
    }


}

