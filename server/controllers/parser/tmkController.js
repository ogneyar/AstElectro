
const Tmk = require('../../service/parser/tmk/Tmk')


class tmkController {

    async tmk(req, res, next) {
        try {
            let { number, add, change, categories, separation } = req.query
            let feed = req.files && req.files.feed || undefined

            let response, tmk
            // создание экземпляра класса Tmk
            tmk = new Tmk()
            // обработка данных файла feed.json
            response = await tmk.run(feed) 
            if ( ! response ) return res.json({error: 'Ошибка! Метод run() не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) { // add = quantity; ~ от 1 до 10 
                return res.json(await tmk.addParty(Number(number), Number(add)))
            }

            // смена цен
            if (change !== undefined) {
                return res.send(await tmk.changePrice())
            }

            // разделение товара на суббренды
            if (separation !== undefined && number) { // separation = quantity; ~ от 1 до 10 
                return res.json(await tmk.separateParty(Number(number), Number(separation)))
            }

            // вывод информации о товаре на экран
            if (number) {
                return res.json(await tmk.print(Number(number)))
            }

            if (categories) {
                return res.send(await tmk.getAllCategories())
                // return res.json(await tmk.getAllCategories())
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await tmk.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода tmk! ' + e}))
        }
    }

}

module.exports = new tmkController()