
const Euroboor = require('../../service/parser/euroboor/Euroboor')


class euroboorController {

    async euroboor(req, res, next) {
        try {
            let { number, add, change } = req.query
            let feed = req.files && req.files.feed || undefined

            let response, euroboor
            // создание экземпляра класса Euroboor
            euroboor = new Euroboor()
            // обработка данных файла feed.xlsx
            response = await euroboor.run({ feed })
            if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) { // add = quantity; ~ от 1 до 10 
                return res.json(await euroboor.addParty(Number(number), Number(add)))
            }

            // смена цен
            if (change !== undefined) {
                return res.send(await euroboor.changePrice())
            }

            // вывод информации о товаре на экран
            if (number && number != 0) {
                return res.json(await euroboor.print(Number(number)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await euroboor.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода euroboor! ' + e}))
        }
    }

}

module.exports = new euroboorController()
