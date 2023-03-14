
const Leidtogi = require('../../service/parser/leidtogi/Leidtogi')


class leidtogiController {

    async leidtogi(req, res, next) {
        try {
            let { number, add, change, number_sheet } = req.query // number_sheet - номер вкладки
            let feed = req.files && req.files.feed || undefined

            if (!number_sheet) number_sheet = 1

            let response, leidtogi
            // создание экземпляра класса Leidtogi
            leidtogi = new Leidtogi()
            // обработка данных файла feed.xlsx
            response = await leidtogi.run(feed, number_sheet)
            if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) { // add = quantity; ~ от 1 до 10 
                return res.json(await leidtogi.addParty(Number(number), Number(add)))
            }

            // смена цен
            if (change !== undefined) {
                return res.send(await leidtogi.changePrice())
            }

            // вывод информации о товаре на экран
            if (number) {
                return res.json(await leidtogi.print(Number(number)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await leidtogi.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода leidtogi! ' + e}))
        }
    }

}

module.exports = new leidtogiController()