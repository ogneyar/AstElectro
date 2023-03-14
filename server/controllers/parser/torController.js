
const Tor = require('../../service/parser/tor/Tor')


class torController {

    async tor(req, res, next) {
        try {
            let { number, add, change, create_categories } = req.query
            let feed = req.files && req.files.feed || undefined
            let response, tor
            // создание экземпляра класса Tor
            tor = new Tor()
            // обработка данных файла feed.xml
            response = await tor.run({ feed, create_categories })
            if ( ! response ) return res.json({error: 'Ошибка! ParseXml не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) { // add = quantity; ~ от 1 до 10 
                return res.json(await tor.addParty(Number(number), Number(add))) 
            }

            // смена цен
            if (change !== undefined) {
                return res.send(await tor.changePrice())
            }

            // вывод информации о товаре на экран
            if (number && number != 0) {
                return res.json(await tor.print(Number(number)))
                // return res.send(await tor.print(Number(number)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await tor.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода tor! ' + e}))
        }
    }

}

module.exports = new torController()
