
const Nzeta = require('../../service/parser/nzeta/Nzeta')
const NzetaAPI = require('../../service/parser/nzeta/NzetaAPI')


class nzetaController {

    async nzeta(req, res, next) {
        try {
            let { number, add, change } = req.query
            let feed = req.files && req.files.feed || undefined            
            let response, nzeta

            // создание экземпляра класса Nzeta
            nzeta = new Nzeta()
            
            // обработка данных файла feed.xlsx
            response = await nzeta.run({ feed })
            if ( ! response ) return res.json({error: 'Ошибка! ParseXlsx не вернул данные!'}) // вывод ошибки

            // добавление нового товара
            if (add !== undefined && number) { // add = quantity; ~ от 1 до 10 
                return res.json(await nzeta.addParty(Number(number), Number(add))) 
            }

            // смена цен
            if (change !== undefined) {
                return res.send(await nzeta.changePrice())
            }

            // вывод информации о товаре на экран
            if (number && number != 0) {
                return res.json(await nzeta.print(Number(number)))
                // return res.send(await nzeta.print(Number(number)))
            }

            // вывод на экран общего количества товаров (например: 372)
            return res.json(await nzeta.getLength()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода nzeta! ' + e}))
        }
    }

    
    async nzetaAPI(req, res, next) {
        try {
            let { method } = req.query

            let api = new NzetaAPI()

            switch(method) {
                case "structure": 
                    return res.json(api.structure())
                break

                default:
                    return res.send("Нет такого метода API!")
                break
            }

        }catch(e) {
            return next(res.json({error: 'Ошибка метода nzetaAPI! ' + e}))
        }
    }

}

module.exports = new nzetaController()
