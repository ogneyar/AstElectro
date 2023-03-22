//
const axios = require('axios')
const XLSX = require('xlsx')
const Math = require('mathjs')
const fs = require('fs')
const path = require('path')
const { Brand, Category, Product } = require('../../../models/models')
const { Op } = require('sequelize')
const createProduct = require('../../product/createProduct.js')
const parseXlsx = require('../../xlsx/parseXlsx')
const ProductDto = require('../../../dtos/productDto')
const printOne = require('./printOne')
const saveInfoInFile = require('../../saveInfoInFile')
const getDateInName = require('../../getDateInName')
const getZipFile = require('../../getZipFile')



module.exports = class Nzeta {
    
    static categories = []
    static product = []
    
    constructor() {}

    async run(args = {}) { 
        let { feed } = args

        let fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'nzeta', 'price.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) 
                fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'nzeta'))) 
                fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'nzeta', 'tor'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'nzeta', feed.name)
            await feed.mv(fullPath)
        }
        else
        {   
            // let dateInNameFile = getDateInName("zip", "price_")
            // if (fs.existsSync(fullPath)) getZipFile(fullPath, path.resolve(__dirname, '..', '..', '..', 'prices', 'nzeta', 'oldFeeds', dateInNameFile))
            // let url = process.env.ZKABEL_URL_PRICE_XLSX
            // let { data } = await axios.get(url, { headers: { 'User-Agent': 'AstElectro' }  })
            // try {
            //     fs.writeFileSync(fullPath, data)
            // } catch (err) {
            //     let responseError = `Записать данные в файл price.xlsx не удалось.`
            //     console.error(responseError)
            //     throw responseError
            // }
        }
            
        if (fs.existsSync(fullPath)) { 
             
            let response = await parseXlsx(fullPath, [
                "Номенклатура",
                "ЕИ",
                "Артикул",
                "Цена",
                "Упак. (мин)",
                "!"
            ])

            if (response.error) throw response.error
            
            if (response && Array.isArray(response)) {
                this.product = response.map(i => {
                    return {
                        name: i["Номенклатура"],
                        measure: i["ЕИ"], // мера (шт., кг., ...)
                        article: i["Артикул"],
                        price: i["Цена"],
                        minimal: i["Упак. (мин)"],
                        attention: i["!"],
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


    // вывод данных на экран
    async print(number) {

        let one = this.product[number - 1]
        return one

        // let response = await printOne(one)

        // return response

    }

    // добавление товара в БД
    async add(number) { 
        // return "add"
        // try {
        //     let print = await this.print(number)

        //     let proDto = new ProductDto(print)
        
        //     let product = await createProduct(proDto)
            
        //     let response = `{${number}: ${product.url} - ${product.price}р. (${product.article})}`
        //     console.log('\x1b[34m%s\x1b[0m', response)

        //     return response
        // }catch(e) {
        //     let response = `{${number}: `
        //     if (typeof(e) === "string") response += `${e.replace("<","&lt;").replace(">","&gt;")}`
        //     else response += JSON.stringify(e)
        //     // response += ` (error)}`
        //     console.log('\x1b[33m%s\x1b[0m', response)
        //     return response
        // }
    }

    
    // добавление партии товара в БД
    async addParty(number, quantity) {
        // return "addParty"
        // if (quantity === 1) return await this.add(number)
        
        // let array = []

        // for(let i = number; i < number+quantity; i++) {
        //     let response = await this.add(i)
        //     array.push(response)
        // }
        
        // return array
    }


    // смена цен
    async changePrice() {
        // let response = `{<br />`
        
        // let brand = await Brand.findOne({ where: { name: "Tor" } })
        // if (brand.id === undefined) return { error: "Не найден бренд товара." }

        // let old = await Product.findAll({ where: { brandId: brand.id } })

        // if (this.product !== undefined) {
            
        //     this.product.forEach(newProduct => {
            
        //         if (newProduct.name == "" || newProduct.price == "") { // если пустая строка
        //             // continue // пропусти
        //         }else {

        //         let myArticle = "tor" + newProduct.article

        //         let newPrice = Math.round( newProduct.price * 100 ) /100

        //         if (response !== `{<br />`) response += ",<br />"
        //         let yes = false
        //         old.forEach(oldProduct => {
        //             if (oldProduct.article === myArticle) {
                        
        //                 if (newPrice != oldProduct.price) {
        //                     response += `"${oldProduct.article}": "Старая цена: ${oldProduct.price}, новая цена: ${newPrice}"`
        //                     Product.update({ price: newPrice },
        //                         { where: { id: oldProduct.id } }
        //                     ).then(()=>{}).catch(()=>{})
        //                 }else {
        //                     response += `"${oldProduct.article}": "Цена осталась прежняя = ${oldProduct.price}"`
        //                 }
        //                 yes = true

        //             }
        //         })
        //         if ( ! yes) response += `"${myArticle}": "Не найден артикул."`
                
        //         }
        //     })
        // }

        // response = response + `<br />}`
        
        // saveInfoInFile(brand.name, "update_price", response) 

        // return response
    }


}

