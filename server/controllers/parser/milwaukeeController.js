const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')
const iconv = require('iconv-lite')
const encoding = require('encoding')


const parseXlsxAndAddNewProduct = require('../../service/parser/milwaukee/vseInstrumenti/addNewProduct')
const getAllData = require('../../service/parser/milwaukee/getAllData.js')
const Milwaukee = require('../../service/parser/milwaukee/Milwaukee')

const parseCsv = require('../../service/csv/parseCsv')

const parseXlsx = require('../../service/xlsx/parseXlsx')

// color text console
// Reset = "\x1b[0m" // Bright = "\x1b[1m" // Dim = "\x1b[2m" // Underscore = "\x1b[4m" // Blink = "\x1b[5m" // Reverse = "\x1b[7m" // Hidden = "\x1b[8m"
// FgBlack = "\x1b[30m" // FgRed = "\x1b[31m" // FgGreen = "\x1b[32m" // FgYellow = "\x1b[33m" // FgBlue = "\x1b[34m" // FgMagenta = "\x1b[35m" // FgCyan = "\x1b[36m" // FgWhite = "\x1b[37m"
// BgBlack = "\x1b[40m" // BgRed = "\x1b[41m" // BgGreen = "\x1b[42m" // BgYellow = "\x1b[43m" // BgBlue = "\x1b[44m" // BgMagenta = "\x1b[45m" // BgCyan = "\x1b[46m" // BgWhite = "\x1b[47m"


class milwaukeeController {
    
    // получение данных из фида xlsx, добавление товаров и обновление цен
    async milwaukee(req, res, next) {

        let { change, number, add, party } = req.query
        let feed = req.files && req.files.feed || undefined

        if (!feed) feed = path.resolve(__dirname, '..', '..', 'prices', 'milwaukee', 'feed.xlsx')
        // if (!feed) return res.json(false)

        let mlk = new Milwaukee()
        let response = await mlk.run(feed)
        
        if (response && response.error === undefined) {
            // получение всех данных из файла
            // if (all) return res.json(await mlk.getAll())
            // получение части данных из файла
            // if (party) {
            //     if (number) return res.json(await mlk.getPart(number, party))
            //     else return res.json({error: 'Ошибка, не задан number при заданном party!'})
            // }
            // обновление цен 
            if (change) {
                if (number && number > 0) return res.json(await mlk.changePrice(number))
                else {
                    if (! number || number == 0) return res.json(await mlk.changePriceAll())
                    if (number && number == -1) return res.json(await mlk.changePriceAll(1))
                    if (number && number == -2) return res.json(await mlk.changePriceAll(2))
                }
            }
            // добавление товара 
            if (add) {
                // return res.json(await mlk.product)
                if ( ! number || number == 0) throw "Не задан number при заданном add"

                if (party && party != 0) return res.json(await mlk.addParty(number, party))
                else return res.json(await mlk.add(number))
            }
            // получение одной записи из файла
            if (number) return res.json(await mlk.getOne(number))
            // получение общего количества данных в файле
            return res.json(await mlk.getLength())
        }

        if (response.error !== undefined) return res.json(response.error)
        
        return res.json(false)
    }
    

    // добавление готовых ссылок в файл с отсутствующими товарами (unknown.csv)
    async addUrls(req, res, next) {
        let query = req.query
        if (query.data === undefined) return res.json({ error: "Отсутствует дата!" })
        let data = query.data
        let feed, response = []
        feed = path.resolve(__dirname, '..', '..', 'prices', 'milwaukee', 'old', 'newMILWAUKEE.xlsx')

        response = await parseXlsx(feed, [ "Артикул", "Категории" ])

        let fullResponse
        feed = path.resolve(__dirname, '..', '..', 'static', 'info', 'milwaukee', data, 'unknown.csv')
        if (fs.existsSync(feed) && iconv.decode(fs.readFileSync(feed), 'win1251') !== "") {
            fullResponse = fs.readFileSync(feed)
        }else {
            return res.json({ error: `Файл info/milwaukee/${data}/unknown.csv отсутствует или пуст!` })
        }        
        // Convert from an encoded buffer to a js string.
        fullResponse = iconv.decode(fullResponse, 'win1251')        
        let products = parseCsv(fullResponse, `Категория`)
        if (products.error !=undefined) return res.json(products)
        let response2 = products.message
        let text = "Категория;Группа;Артикул;Модель;Цена;Ссылка\r\n" + response2.map(i => {
            let article = i["Артикул"]
            let url = ""
            response.forEach(j => {
                if (Number(j["Артикул"]) === Number(article)) url = j["Категории"]
            })
            return `${i["Категория"]};${i["Группа"]};${article};"${i["Модель"] && i["Модель"].replace(/\"/g, "&quot;")}";${i["Цена"]};${url}\r\n`
        }).join("")
        let unknown = path.resolve(__dirname, '..', '..', 'static', 'info', 'milwaukee', data, 'unknownWithUrls.csv')
        let urlUnknown
        try {
            fs.writeFileSync( unknown, encoding.convert(text, 'WINDOWS-1251', 'UTF-8') )
            urlUnknown = `${process.env.URL}/info/milwaukee/${data}/unknownWithUrls.csv`
        }catch(e) {
            urlUnknown = `Создать файл unknownWithUrls.csv не удалось.`
        }

        return res.json(urlUnknown)
    }

    
    // добавление новых товаров
    async addNewProduct(req, res, next) {
        // по сколько товаров за раздобавлять
        let party = 10
        let { number } = req.query
        let feed = req.files && req.files.feed || undefined
        let workbook
        if (feed) {
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', 'static', 'temp'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', 'static', 'temp'))
            if (!fs.existsSync(path.resolve(__dirname, '..', '..', 'static', 'temp', 'mlk'))) fs.mkdirSync(path.resolve(__dirname, '..', '..', 'static', 'temp', 'mlk'))
            let fullPath = path.resolve(__dirname, '..', '..', 'static', 'temp', 'mlk', feed.name)
            await feed.mv(fullPath)
            workbook = XLSX.readFile(fullPath)
        }else return res.json({ error: `Файл отсутствует или пуст!` })
        
        let product, message, response

        // let workbook = XLSX.readFile('newMILWAUKEE.xlsx')
        // если number = 0 значит добавляем партию товаров (от number до party)
        if ( ! number ) {
            for(let i = Number(number); i < Number(number)+Number(party); i++) {

                try{
                    product = await parseXlsxAndAddNewProduct(workbook, i)
                }catch(e) {
                    product = e
                }
            
                if (product.article) {
                    message = `${i}. Товар с артикулом ${product.article} добавлен.`
                    console.log('\x1b[34m%s\x1b[0m', message)
                }else {
                    message = `${i}. Ошибка: ${product}`
                    console.log('\x1b[33m%s\x1b[0m', message)
                }
        
                message = message + "<br />"
                if (response) response = response + message
                else response = message

            }
        }else {
            
            try{
                product = await parseXlsxAndAddNewProduct(workbook, number)
            }catch(e) {
                product = e
            }
        
            if (product.article) {
                message = `${i}. Товар с артикулом ${product.article} добавлен.`
                console.log('\x1b[34m%s\x1b[0m', message)
            }else {
                message = `${i}. Ошибка: ${product}`
                console.log('\x1b[33m%s\x1b[0m', message)
            }
    
            message = message + "<br />"
            if (response) response = response + message
            else response = message

        }

        return res.send(response)
    }
    

    // получение всех данных о товаре
    async getAll(req, res, next) {
        let { article } = req.query  // 4933471077
        let response

        try{
            response = await getAllData(article)

            return res.json(response) // return array 

        }catch(e) {
            return res.json({error:e})
        }
    }

    


}

module.exports = new milwaukeeController()