
const Kedr = require('../../service/parser/kedr/Kedr')


class kedrController {

    async kedr(req, res, next) {
        try {
            let { number, add, change, lprice } = req.query
            let feed = req.files && req.files.feed || undefined
            let price = req.files && req.files.price || undefined

            let response, kedr
            // создание экземпляра класса Kedr
            kedr = new Kedr()
            if ( ! change ) { // если НЕ смена цен
                // обработка данных файла feed.xlsx
                response = await kedr.run(feed)
                if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки
            }
            // обработка данных файла price.xlsx
            response = await kedr.run_price(price)
            if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) {
                return res.json(await kedr.add(Number(number), Number(add)))
            }

            // смена цен
            if (change !== undefined) {
                return res.send(await kedr.changePrice())
            }

            // вывод информации о товаре на экран
            if (number) {
                return res.json(await kedr.print(Number(number)))
            }

            if (lprice) {
                return res.json(await kedr.getLengthPrice()) 
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await kedr.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода kedr! ' + e}))
        }
    }

}

module.exports = new kedrController()