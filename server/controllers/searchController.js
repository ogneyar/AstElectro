
const find = require("../service/search/find")


class SearchController {    

    async value(req, res, next) {
        try {
            let response = [], args
            if (req.query && req.query.value !== undefined) args = req.query
            else args = req.body

            let { value, limit, page } = args
            
            page = Number(page) || 1
            limit = Number(limit) || 12

            let offset = page * limit - limit

            if (value) {
                response = await find("value", value)
                let array = []
                for (let idx = offset; idx < offset + limit; idx++) {
                    if (idx >= response.count) break
                    if (response.rows[idx]) 
                        array.push(response.rows[idx])
                }
                response.rows = array
            }

            return res.json(response)
        }catch(e) {
            return next(res.json({ error: `Ошибка метода value! (${e})` }))
        }
    }

    async article(req, res, next) {
        try {
            let response = [], args
            if (req.query && req.query.text !== undefined) args = req.query
            else args = req.body

            let { text, limit } = args

            if (text) {
                response = await find("article", text)
            }

            if (limit) return res.json(response.filter((i,index) => index <= limit))

            return res.json(response)
        }catch(e) {
            return next(res.json({ error: `Ошибка метода article! (${e})` }))
        }
    }

    async name(req, res, next) {
        try {
            let response = []
            let args
            if (req.query && req.query.text !== undefined) args = req.query
            else args = req.body

            let { text, limit } = args

            if (text) {
                response = await find("name", text)
            }

            if (limit) return res.json(response.filter((i,index) => index <= limit))

            return res.json(response)
        }catch(e) {
            return next(res.json({ error: `Ошибка метода name! (${e})` }))
        }
    }

}


module.exports = new SearchController()