
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

    /*
    req.query = { method, limit, z_id }
    
    Methods:
        structure
        structure_description
        items
        items_description
        purpose_name
        items_picture
        items_docs = []
        mask
        properties_group
        properties_purpose
        properties = []
        properties_values
        properties_items
        items_info = 404 PageNotFound
    */
    async nzetaAPI(req, res, next) {
        try {
            let api = new NzetaAPI()
            return res.json(await api.post(req.query))
        }catch(e) {
            return next(res.json({error: 'Ошибка метода nzetaAPI! ' + e}))
        }
    }

}

module.exports = new nzetaController()
