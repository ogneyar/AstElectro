
const Krause = require('../../service/parser/krause/Krause')


class krauseController {

    async krause(req, res, next) {
        try {
            let { number, add, change } = req.query
            let feed = req.files && req.files.feed || undefined
            let price = req.files && req.files.price || undefined

            let response, krause
            // создание экземпляра класса Krause
            krause = new Krause()
            if ( ! change ) { // если НЕ смена цен
                // обработка данных файла feed.xlsx
                response = await krause.run(feed)
                if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки
            }
            // обработка данных файла price.xlsx
            response = await krause.run_price(price)
            if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) {
                return res.json(await krause.add(Number(number), Number(add)))
            }

            // смена цен
            if (change !== undefined) {
                return res.send(await krause.changePrice())
            }

            // вывод информации о товаре на экран
            if (number) {
                return res.json(await krause.print(Number(number)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await krause.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода krause! ' + e}))
        }
    }

}

module.exports = new krauseController()