
const KVT = require('../../service/parser/kvt/KVT')
const ParseKvtSu = require('../../service/parser/kvt/parseKvtSu')
const savePriceInFile = require('../../service/savePriceInFile')


class kvtController {

    async kvt(req, res, next) {
        try {
            let { number, add, change } = req.query
            let feed = req.files && req.files.feed || undefined
            let price = req.files && req.files.price || undefined
            let price_json = req.files && req.files.price_json || undefined

            let response, kvt
            // создание экземпляра класса KVT
            kvt = new KVT()
            if ( ! change ) { // если НЕ смена цен
                // обработка данных файла feed.xlsx
                response = await kvt.run(feed)
                if ( ! response ) return res.json({error: 'Ошибка! Метод run() не вернул данные!'})
                // обработка данных файла price.xlsx (прайс для заведения товаров)
                response = await kvt.run_price(price)
                if ( ! response ) return res.json({error: 'Ошибка! Метод run_price() не вернул данные!'})
            }

            // добавление нового товара
            if (add !== undefined && number) {
                return res.json(await kvt.add(Number(number), Number(add)))
            }

            // смена цен
            if (change !== undefined) { 
                response = await kvt.run_price_json(price_json) 
                if (response.error !== undefined) return res.json(response.error)
                if ( ! response ) return res.json({error: 'Ошибка! Метод run_price_json() не вернул данные!'})
                
                return res.send(await kvt.changePrice())
            }

            // вывод информации о товаре на экран
            if (number) {
                return res.json(await kvt.print(Number(number)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await kvt.getLength()) 

        }catch(e) {
            return res.json({error: 'Ошибка метода kvt! ' + e})
        }
    }


    async parseKvtSu(req, res, next) {
        try {
            let { catalog, numberCatalog, lengthCatalog, products, numberProduct, lengthProducts, prices } = req.query
            let feed = req.files && req.files.feed || undefined

            let response
            // создание экземпляра класса KVT
            let parse = new ParseKvtSu()

            response = await parse.run()
            if (! response) return res.json({error: 'Ошибка! Метод run() не вернул данные!'})

            if (catalog) { // нет обязательных параметров
                return res.json(await parse.getCatalog(numberCatalog))
            }
            
            if (lengthCatalog) { 
                return res.json(await parse.getLengthCatalog())
            }

            if (products) { // numberCatalog - обязательный параметр
                return res.json(await parse.getProducts(numberCatalog, numberProduct))
            }

            if (lengthProducts) { // numberCatalog - обязательный параметр
                return res.json(await parse.getLengthProducts(numberCatalog))
            }

            if (prices) { // оба параметра обязательны
                return res.json(await parse.getPrices(numberCatalog, numberProduct))
            }

            // по умолчанию (если не задан ни один параметр)
            return res.json(await parse.getLengthCatalog()) 

        }catch(e) {
            return res.json({error: 'Ошибка метода parseKvtSu!'})// ' + e})
        }
    }

    // сохранение прайса в файл json
    async savePrice(req, res, next) {
        try {
            let { json } = req.body
            if (! json) {
                if (req.query && req.query.json) json = req.query.json
                else throw "Отсутствует тело запроса."
            }

            savePriceInFile("KVT", json)

            return res.json(true) 
        }catch(e) {
            return res.json({error: 'Ошибка метода savePrice! ' + e})
        }
    }


}

module.exports = new kvtController()