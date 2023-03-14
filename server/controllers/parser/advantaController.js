
const Advanta = require('../../service/parser/advanta/Advanta')


class advantaController {

    async advanta(req, res, next) {
        try {
            let { number, add, change, chapter } = req.query
            let feed = req.files && req.files.feed || undefined

            let response, advanta
            // создание экземпляра класса Advanta
            advanta = new Advanta()
            // обработка данных файла feed.xlsx
            response = await advanta.run({ feed, chapter })
            if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) { // add = quantity; ~ от 1 до 10 
                return res.json(await advanta.addParty(Number(number), Number(add)))
            }

            // смена цен
            if (change !== undefined) {
                // return res.send(await advanta.changePrice())
            }

            // вывод информации о товаре на экран
            if (number && number != 0) {
                return res.json(await advanta.print(Number(number)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await advanta.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода advanta! ' + e}))
        }
    }

}

module.exports = new advantaController()
