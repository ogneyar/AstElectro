
const Nzeta = require('../../service/parser/nzeta/Nzeta')
const NzetaAPI = require('../../service/parser/nzeta/NzetaAPI')
const ParseNzetaRu = require('../../service/parser/nzeta/parseNzetaRu')


class nzetaController {
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
        product/getProduct // api_2_url
    */
    async nzetaAPI(req, res, next) {
        try {
            let api = new NzetaAPI()
            
            let { 
                // основные параметры API nzeta
                method, site, limit, id, z_id, d_id, guid, parentguid, artikul, 
                TNVED, type, g_id, p_type, code, p_id, item_id, article,
                // мои параметры
                name, s_id, descr, cat_id
            } = req.query
            
            if ( ! method ) method = req.body.method
            if ( ! site ) site = req.body.site
            if ( ! limit ) limit = req.body.limit
            if ( ! id ) id = req.body.id
            if ( ! z_id ) z_id = req.body.z_id
            if ( ! d_id ) d_id = req.body.d_id
            if ( ! guid ) guid = req.body.guid
            if ( ! parentguid ) parentguid = req.body.parentguid
            if ( ! artikul ) artikul = req.body.artikul
            if ( ! TNVED ) TNVED = req.body.TNVED
            if ( ! type ) type = req.body.type
            if ( ! g_id ) g_id = req.body.g_id
            if ( ! p_type ) p_type = req.body.p_type
            if ( ! code ) code = req.body.code
            if ( ! p_id ) p_id = req.body.p_id
            if ( ! item_id ) item_id = req.body.item_id
            if ( ! article ) article = req.body.article

            if ( ! name ) name = req.body.name
            if ( ! s_id ) s_id = req.body.s_id
            if ( ! descr ) descr = req.body.descr
            if ( ! cat_id ) cat_id = req.body.cat_id

            let options = {
                method, site, limit, id, z_id, d_id, guid, parentguid, artikul, 
                TNVED, type, g_id, p_type, code, p_id, item_id, article, 
                name, s_id, descr, cat_id
            }
            
            if (method === "product/getProduct") 
            {
                return res.json(await api.get(options))
            }else 
            {
                return res.json(await api.post(options))
            }
        }catch(e) {
            return next(res.json({error: 'Ошибка метода nzetaAPI! ' + e}))
        }
    }

    async parseNzetaRu(req, res, next) {
        try {            
            
            let { article, get_categories } = req.query

            // создание экземпляра класса ParseNzetaRu
            let parse = new ParseNzetaRu()

            let response = await parse.run()
            if (! response) return res.json({error: 'Ошибка! Метод run() не вернул данные!'})

            if (get_categories) { // article - обязательный параметр
                if (! article) return res.json({error: 'Ошибка! Отсутствует необходимый параметр "article"!'})
                return res.json(await parse.getCategories(article))
            }
            
            // по умолчанию (если не задан ни один параметр)
            return res.json(await parse.getEcho()) 

        }catch(e) {
            return next(res.json({error: 'Ошибка метода parseNzetaRu! ' + e}))
        }
    }
    

    // old method
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


}

module.exports = new nzetaController()
