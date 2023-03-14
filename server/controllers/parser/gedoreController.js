
const Gedore = require('../../service/parser/gedore/Gedore')


class gedoreController {

    async gedore(req, res, next) {
        try {
            let { number, add, change } = req.query
            let feed = req.files && req.files.feed || undefined

            let response, gedore
            // создание экземпляра класса Gedore
            gedore = new Gedore()
            // обработка данных файла feed.xlsx
            response = await gedore.run(feed)
            if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) { // add = quantity; ~ от 1 до 10 
                return res.json(await gedore.addParty(Number(number), Number(add)))
            }

            // смена цен
            if (change !== undefined) {
                return res.send(await gedore.changePrice())
            }

            // вывод информации о товаре на экран
            if (number) {
                return res.json(await gedore.print(Number(number)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await gedore.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода gedore! ' + e}))
        }
    }

}

module.exports = new gedoreController()