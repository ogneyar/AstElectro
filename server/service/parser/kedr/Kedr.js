
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
// const getImages = require('./getImages')
const saveInfoInFile = require('../../saveInfoInFile')


module.exports = class Krause {
    
    static product = []
    static price = []
    static price1 = []
    static price2 = []
    static price3 = []
    static price4 = []

    
    constructor() {
    }

    async run(feed = {}) {
        let fullPath, response

        fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'kedr', 'feed.xlsx')

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kedr'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kedr'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kedr', feed.name)
            await feed.mv(fullPath)
        }
            
        if (fs.existsSync(fullPath)) { 
            
            response = await parseXlsx(fullPath, [
                "Наименование",
                "IE_PREVIEW_TEXT",
                "IE_DETAIL_PICTURE",
                "Описание детальное",
                "Напряжение",
                "Диаметр проволоки",
                "Артикул поставщика",
                "Ссылка на видео",
                "Функция горячий старт",
                "Максимально допустимый ток",
                "Функция VRD",	
                "Функция Антизалипание",	
                "Продуктовый сегмент",	
                "Функция Lift TIG",	
                "Длина в упаковке",	
                "Ширина в упак",	
                "Высота в упак",	
                "Габариты",	
                "Вес брутто, кг.",	
                "ПВ %",	
                "Напряжение холостого хода",	
                "Диаметр электрода",	
                "Максимальный ток",	
                "Наличие ячеек памяти",	
                "Вес нетто, кг.",	
                "Толщина реза",	
                "Диапозон сварочного -тока",	
                "Напряжение3",	
                "Бренд",	
                "Группа товара 1",	
                "Группа товара 2",	
                "Группа товара 3",	
                "Цена",	
                "Валюта",

            ])
            
            if (response && Array.isArray(response)) {
                this.product = response.map(i => {
                    return {
                        name: i["Наименование"],
                        preview: i["IE_PREVIEW_TEXT"],
                        image: i["IE_DETAIL_PICTURE"],
                        description: i["Описание детальное"],
                        voltage: i["Напряжение"],
                        diameter: i["Диаметр проволоки"],
                        article: i["Артикул поставщика"],
                        url_video: i["Ссылка на видео"],
                        hot_start: i["Функция горячий старт"],
                        maximum_allowable_current: i["Максимально допустимый ток"],
                        vrd: i["Функция VRD"],
                        anti_salting: i["Функция Антизалипание"],
                        segment: i["Продуктовый сегмент"],
                        tig: i["Функция Lift TIG"],
                        length: i["Длина в упаковке"],
                        width: i["Ширина в упак"],
                        height: i["Высота в упак"],
                        dimensions: i["Габариты"],
                        weight_brutto: i["Вес брутто, кг."],
                        pv: i["ПВ %"],
                        idling: i["Напряжение холостого хода"],
                        diameter_electrode: i["Диаметр электрода"],
                        maximum_current: i["Максимальный ток"],
                        memory_cells: i["Наличие ячеек памяти"],
                        weight_netto: i["Вес нетто, кг."],
                        cutting_thickness: i["Толщина реза"],
                        welding_current_range: i["Диапозон сварочного -тока"],
                        voltage3: i["Напряжение3"],
                        brand: i["Бренд"],
                        group1: i["Группа товара 1"],
                        group2: i["Группа товара 2"],
                        group3: i["Группа товара 3"],
                        price: i["Цена"],
                        currency: i["Валюта"],
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

        if (feed && feed.name !== undefined) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kedr'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kedr'))
            fullPath = path.resolve(__dirname, '..', '..', '..', 'static', 'temp', 'kedr', feed.name)
            await feed.mv(fullPath)

            if (fs.existsSync(fullPath)) { 
            
                response = await parseXlsx(fullPath, [
                    "КОД ДЛЯ ЗАКАЗА",
                    "НАИМЕНОВАНИЕ",
                    "РОЗНИЧНАЯ ЦЕНА, РУБ.",
                ])
                
                if (response && Array.isArray(response)) {
                    this.price1 = response.map(i => {
                        return {
                            article: i["КОД ДЛЯ ЗАКАЗА"],
                            name: i["НАИМЕНОВАНИЕ"],
                            price: i["РОЗНИЧНАЯ ЦЕНА, РУБ."],
                        }
                    })
                    return true
                }
    
            }else {
                throw `Файл ${fullPath} отсутствует или пуст!`
            }

        }else { // берём четыре прайса с сервера

            fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'kedr', 'price1.xlsx') // газосварочное оборудование

            if (fs.existsSync(fullPath)) { 
            
                response = await parseXlsx(fullPath, [
                    "КОД ДЛЯ ЗАКАЗА",
                    "НАИМЕНОВАНИЕ",
                    "РОЗНИЧНАЯ ЦЕНА, в руб. с НДС",
                ])
                
                if (response && Array.isArray(response)) {
                    this.price1 = response.map(i => {
                        return {
                            article: i["КОД ДЛЯ ЗАКАЗА"],
                            name: i["НАИМЕНОВАНИЕ"],
                            price: i["РОЗНИЧНАЯ ЦЕНА, в руб. с НДС"],
                        }
                    })
                }
    
            }else {
                //throw `Файл ${fullPath} отсутствует или пуст!`
            }
    
            fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'kedr', 'price2.xlsx') // оборудование КЕДР
            
            if (fs.existsSync(fullPath)) { 
            
                response = await parseXlsx(fullPath, [
                    "КОД ДЛЯ ЗАКАЗА",
                    "НАИМЕНОВАНИЕ",
                    "ХАРАКТЕРИСТИКИ",
                    "РОЗНИЧНАЯ ЦЕНА, РУБ.",
                ])
                
                if (response && Array.isArray(response)) {
                    this.price2 = response.map(i => {
                        return {
                            article: i["КОД ДЛЯ ЗАКАЗА"],
                            name: i["НАИМЕНОВАНИЕ"],
                            characteristics: i["ХАРАКТЕРИСТИКИ"],
                            price: i["РОЗНИЧНАЯ ЦЕНА, РУБ."],
                        }
                    })
                }
    
            }else {
                //throw `Файл ${fullPath} отсутствует или пуст!`
            }

            fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'kedr', 'price3.xlsx') // расходные материалы КЕДР
            
            if (fs.existsSync(fullPath)) { 
            
                response = await parseXlsx(fullPath, [
                    "КОД ДЛЯ ЗАКАЗА",
                    "НАИМЕНОВАНИЕ",
                    "РОЗНИЧНАЯ ЦЕНА, РУБ.",
                ])
                
                if (response && Array.isArray(response)) {
                    this.price3 = response.map(i => {
                        return {
                            article: i["КОД ДЛЯ ЗАКАЗА"],
                            name: i["НАИМЕНОВАНИЕ"],
                            price: i["РОЗНИЧНАЯ ЦЕНА, РУБ."],
                        }
                    })
                }
    
            }else {
                //throw `Файл ${fullPath} отсутствует или пуст!`
            }

            fullPath = path.resolve(__dirname, '..', '..', '..', 'prices', 'kedr', 'price4.xlsx') // СИМЗ (выпрямители и реостаты)

            if (fs.existsSync(fullPath)) { 
            
                response = await parseXlsx(fullPath, [
                    "Артикулы",
                    "Наименование",
                    "Характеристики",
                    "РРЦ, руб",
                ])
                
                if (response && Array.isArray(response)) {
                    this.price4 = response.map(i => {
                        return {
                            article: i["Артикулы"],
                            name: i["Наименование"],
                            characteristics: i["Характеристики"],
                            price: i["РРЦ, руб"],
                        }
                    })
                }
    
            }else {
                //throw `Файл ${fullPath} отсутствует или пуст!`
            }


            return true
        }
        
        return false
    }

    // количество записей в feed.xlsx
    async getLength() {
        return this.product.length
    }

    // количество записей в price.xlsx
    async getLengthPrice() {
        return this.price1.length + this.price2.length + this.price3.length + this.price4.length
        
    }

    // получение заданной категории
    async getCategories(iter) {

        let response = ""

        if (iter.group1 === "Газосварочное оборудование") {
            response = iter.group1 
            if (iter.group2 === "Редукторы") response = "gazosvarochnoe-oborudovanie_reduktory"
            else if (iter.group2 === "Регуляторы") response = "regulyatory"
            else if (iter.group2 === "Манометры") response = "gazosvarochnoe-oborudovanie_manometry"
            else if (iter.group2 === "Горелки") response = "gorelki"
            else if (iter.group2 === "Резаки газовые") response = "rezaki-gazovye"
            else response += " && " + iter.group2

            if (iter.group3) {
                if (iter.group2 === "Комплектующие") {
                    if (iter.group3 === "Предохранительные затворы") response = "predohranitelnye-zatvory"
                    else if (iter.group3 === "Прочее") response = "komplektuyuschie_prochee"
                    else if (iter.group3 === "Мундштуки") response = "mundshtuki"
                    else if (iter.group3 === "Обратные клапаны") response = "obratnye-klapany"
                }else response += " && " + iter.group3
            }
        }

        if (iter.group1 === "Сварочные горелки/ резаки") {
            response = iter.group1 
            if (iter.group2 === "Комплектующие") response = "komplektuyuschie_prochee"
            else if (iter.group2 === "Плазмотроны CUT") response = "plazmotrony-cut"
            else if (iter.group2 === "Клеммы и электрододержатели") response = "elektrododerzhateli-i-klemmy"
            else if (iter.group2 === "Горелки для MIG/MAG") response = "gorelki-dlya-mig-mag"
            else if (iter.group2 === "Горелки для TIG") response = "gorelki-dlya-tig"
            else response += " && " + iter.group2

            if (iter.group3) {
                if (iter.group2 !== "Комплектующие") response += " && " + iter.group3
            }
        }

        if (iter.group1 === "Средства защиты") {
            response = iter.group1 
            if (iter.group2 === "Краги / Перчатки") response = "zaschita-ruk"
            else if (iter.group2 === "Маски сварщика") response = "maski-svarschika"
            else if (iter.group2 === "Комплектующие к маскам") response = "prochie-aksessuary"
            else if (iter.group2 === "Очки защитные") response = "sredstva-zaschity"
            else response += " && " + iter.group2

            if (iter.group3) {
                response += " && " + iter.group3
            }
        }

        if (iter.group1 === "Дополнительное оборудование") {
            response = iter.group1 
            if (iter.group2 === "Инструменты") response = "instrumenty"
            else if (iter.group2 === "Прочее") response = "dopolnitelnoe-oborudovanie_prochee"
            else if (iter.group2 === "Термопеналы и электропечи") response = "termopenaly-i-elektropechi"
            else if (iter.group2 === "Блоки жидкостного охлаждения") response = "bloki-zhidkostnogo-ohlazhdeniya"
            else if (iter.group2 === "Педали / Пульты ДУ") response = "pedali-pulty-du"
            else if (iter.group2 === "Тележки сварочные") response = "telezhki-svarochnye"
            else response += " && " + iter.group2
            
            if (iter.group3) {
                response += " && " + iter.group3
            }
        }
        
        if (iter.group1 === "Сварочные аппараты") {
            response = iter.group1 
            
            if (iter.group2) {
                response += " && " + iter.group2
            }else response = "svarochnoe-oborudovanie_raznoe"
            
            if (iter.group3) {
                if (iter.group2 === "Комплектующие") response = "svarochnoe-oborudovanie_raznoe"
                else if (iter.group2 === "Серия КЕДР Pro") {
                    if (iter.group3 === "CUT") response = "cut"
                    else if (iter.group3 === "TIG") response = "tig"
                    else if (iter.group3 === "MIG/ MAG") response = "mig-mag"
                    else if (iter.group3 === "MMA / ARC") response = "mma-arc"
                    else if (iter.group3 === "SAW") response = "saw"
                    else response += " && " + iter.group3
                }
                else if (iter.group2 === "Серия КЕДР Prime") {
                    if (iter.group3 === "CUT") response = "prime_cut"
                    else if (iter.group3 === "TIG") response = "prime_tig"
                    else if (iter.group3 === "MMA / ARC") response = "prime_mma-arc"
                    else if (iter.group3 === "MIG / MAG") response = "prime_mig-mag"
                    else response += " && " + iter.group3
                }
                else response += " && " + iter.group3
            }
        }

        if (iter.group1 === "Расходные материалы") {
            response = iter.group1 

            if (iter.group2) {
                if (iter.group2 === "Электроды для ручной сварки") response = "elektrody-dlya-ruchnoy-svarki"
                else if (iter.group2 === "Электроды вольфрамовые") response = "elektrody-volframovye"
                else response += " && " + iter.group2
            }else response = "rashodnye-materialy"

            
            if (iter.group3) {
                if (iter.group2 === "Прутки присадочные") {
                    if (iter.group3 === "Прутки алюминиевые") response = "prutki-alyuminievye"
                    else if (iter.group3 === "Прутки из нержавеющей стали") response = "prutki-iz-nerzhaveyuschey-stali"
                    else if (iter.group3 === "Прутки омедненные") response = "prutki-omednennye"
                    else if (iter.group3 === "Прутки латунные") response = "prutki-latunnye"
                    else if (iter.group3 === "Прутки медные") response = "prutki-alyuminievye"
                    else response += " && " + iter.group3
                }
                else if (iter.group2 === "Проволка сварочная") {
                    if (iter.group3 === "Проволока омедненная") response = "provoloka-omednennaya"
                    else if (iter.group3 === "Проволока из нержавеющей стали") response = "provoloka-iz-nerzhaveyuschey-stali"
                    else if (iter.group3 === "Проволока аллюминиевая") response = "provoloka-allyuminievaya"
                    else if (iter.group3 === "Проволока порошковая") response = "provoloka-poroshkovaya"
                    else response += " && " + iter.group3
                }
                else response += " && " + iter.group3
            }
        }

        if ( ! response) throw "Не найдена категория товара"
        
        return response

    }

    // вывод данных на экран
    async print(number) {

        this.price = [
            ...this.price1,
            ...this.price2,
            ...this.price3,
            ...this.price4
        ]

        let one = this.product[number - 1]

        if (one.name.includes("яяя на удаление")) return { error: "Товар на удаление." }

        let one_price

        // return this.price

        let article = one.article
        let price
        this.price.forEach(i => {
            if (i.article === article) {
                price = i.price 
                one_price = i
            }
        })

        // if ( ! price ) return { error: "Не найдена цена товара." }

        if ( ! price || price === "по запросу") price = 0

        let categoryUrl = await this.getCategories(one)

        let category = await Category.findOne({ where: { url: categoryUrl} })
        let categoryId = category.id

        if (!categoryId || categoryId === 0) return { error: "Не найдена категория товара." }

        let brand = await Brand.findOne({ where: { name: "Kedr" } })
        
        if (brand.id === undefined) return { error: "Не найден бренд товара." }
        
        article = "kdr" + article
        
        let name = one.name
        let url = translit(name) + "_" + article

        let product = await Product.findOne({ where: { url } })
        if (product && product.id !== undefined) return { error: "Такой товар уже есть." }
        
        let image = one.image // ссылка типа www.kedrweld.ru/upload/iblock/13d/fuj9m92t4t69w3tsz0vnq3hkes15rqfc.jpeg (или #Н/Д`)
        
        let files = `[`

        if (image && image != "#Н/Д" && image != 42 && image != "www.kedrweld.ru") {
            
            let imageName = '1.jpg'

            try{
                createFoldersAndDeleteOldFiles("kedr", article)

                let imageBig = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'kedr', article, 'big', imageName))
                let imageSmall = fs.createWriteStream(path.resolve(__dirname, '..', '..', '..', 'static', 'kedr', article, 'small', imageName))
    
                https.get("https://" + image, (res) => {
                    res.pipe(imageBig)
                    res.pipe(sharp().resize(100)).pipe(imageSmall)
                })
            }catch(e) {
                return { error: "Не найдено изображение товара." }
            }

            files += `{"big":"kedr/${article}/big/${imageName}","small":"kedr/${article}/small/${imageName}"}`
        }else {
            files += `{}`
        }

        files += `]`
        
        let info = []
        if (one.description) {
            info.push( { 
                title: "description", 
                body: one.description
                    .replace("<H3>Описание:</H3>", "")
                    .replace(/\r\n/g, "")
                    .replace(`<img alt="" src="https://www.ligasvarki.ru/wcmfiles/Russia.jpg" style="float:left; height:20px; margin:0px 3px; width:30px" />`, "")
            } )
        }
        let characteristics = ""
        if (one.diameter) {
            if (characteristics) characteristics += ";"
            characteristics += "Диаметр проволоки;" + one.diameter
        }
        if (one.hot_start) {
            if (characteristics) characteristics += ";"
            characteristics += "Функция горячий старт;" + one.hot_start
        }
        if (one.maximum_allowable_current) {
            if (characteristics) characteristics += ";"
            characteristics += "Максимально допустимый ток;" + one.maximum_allowable_current
        }
        if (one.vrd) {
            if (characteristics) characteristics += ";"
            characteristics += "Функция VRD;" + one.vrd
        }
        if (one.anti_salting) {
            if (characteristics) characteristics += ";"
            characteristics += "Функция Антизалипание;" + one.anti_salting
        }
        if (one.segment) {
            if (characteristics) characteristics += ";"
            characteristics += "Продуктовый сегмент;" + one.segment
        }
        if (one.tig) {
            if (characteristics) characteristics += ";"
            characteristics += "Функция Lift TIG;" + one.tig
        }
        if (one.dimensions) {
            if (characteristics) characteristics += ";"
            characteristics += "Габариты;" + one.dimensions
        }
        if (one.pv) {
            if (characteristics) characteristics += ";"
            characteristics += "ПВ %;" + one.pv
        }
        if (one.idling) {
            if (characteristics) characteristics += ";"
            characteristics += "Напряжение холостого хода;" + one.idling
        }
        if (one.diameter_electrode) {
            if (characteristics) characteristics += ";"
            characteristics += "Диаметр электрода;" + one.diameter_electrode
        }
        if (one.maximum_current) {
            if (characteristics) characteristics += ";"
            characteristics += "Максимальный ток;" + one.maximum_current
        }
        if (one.memory_cells) {
            if (characteristics) characteristics += ";"
            characteristics += "Наличие ячеек памяти;" + one.memory_cells
        }
        if (one.cutting_thickness) {
            if (characteristics) characteristics += ";"
            characteristics += "Толщина реза;" + one.cutting_thickness
        }
        if (one.welding_current_range) {
            if (characteristics) characteristics += ";"
            characteristics += "Диапозон сварочного тока;" + one.welding_current_range
        }
        if (one.voltage3) {
            if (characteristics) characteristics += ";"
            characteristics += "Напряжение3;" + one.voltage3
        }

        if (characteristics) info.push( { title: "characteristics",body: characteristics } )


        let size = {}
        
        if (isNaN(one.weight_brutto)) {
            if (one.weight_brutto.includes(",???")) one.weight_brutto = one.weight_brutto.replace(",???", "")
            else one.weight_brutto = ""
        }
        let weight = 0
        if (one.weight_brutto) weight = one.weight_brutto
        else if (one.weight_netto) weight = one.weight_netto
        
        let length = one.length
        let width = one.width
        let height = one.height

        let volume = 0

        if (length.includes(",???") || width.includes(",???") || height.includes(",???")) {

            if (one.dimensions) {
                
                let dimensions = one.dimensions.replace(/х/g, "x").replace(/Х/g, "x").replace(/X/g, "x")
                let split = dimensions.split("x") 

                if (split.length > 1) {
                    length = split[0].trim()
                    width = split[1].trim()
                    height = split[2].trim()
                }

            }

        }
        
        if (length && width && height) {
            volume = ((length*width*height) / 1e9).toFixed(4)
            if (volume == 0.0000) volume = 0.0001
        }
        
        size = { 
            weight,
            width,
            height, 
            length, 
            volume 
        }

        
        return {
            categoryId,
            brandId: brand.id, 
            article, 
            name,
            url,
            have: 1, 
            promo: "",
            country: "Китай",
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
        
        let brand = await Brand.findOne({ where: { name: "Kedr" } })
        if (brand.id === undefined) return { error: "Не найден бренд товара." }

        let products = await Product.findAll({ where: { brandId: brand.id } })

        this.price.forEach(newProduct => {
            if (response !== `{<br />`) response += ",<br />"
            let yes = false
            products.forEach(oldProduct => {
                if (oldProduct.article === `kdr${newProduct.article}`) {
                    let newPrice = newProduct.price
                    newPrice = Math.round(newPrice * 100) / 100
                    if (newPrice != oldProduct.price) {
                        response += `"kdr${newProduct.article}": "Старая цена = ${oldProduct.price}, новая цена = ${newPrice}.`
                        Product.update({ price: newPrice },
                            { where: { id: oldProduct.id } }
                        ).then(()=>{}).catch(()=>{})
                    }else {
                        response += `"kdr${newProduct.article}": "Цена осталась прежняя = ${oldProduct.price}."`
                    }
                    yes = true
                }
            })
            if ( ! yes) response += `"kdr${newProduct.article}": "Не найден артикул."`
        })
        response = response + `<br />}`

        saveInfoInFile(brand.name, "update_price", response)

        return response
    }


}
