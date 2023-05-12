
const mailService = require('../service/mailService')


class mailController {
    
    async requestPrice(req, res, next) {
        try {
            let body = req.body
            if (!body || body === {}) body = req.query
            let response
            await mailService.sendRequestPrice(process.env.ADMIN_EMAIL, body) 
                .then(data => {
                    response = true
                    console.log(data)
                })
                .catch(err => {
                    response = false
                    console.log(err)
                })

            return res.json(response)
        }catch(e) {
            return next(res.json( { error: 'Ошибка метода requestPrice!' } ))
        }
    }
    
    async requestProducts(req, res, next) {
        try {
            let body = req.body
            if (!body || body === {}) body = req.query
            let response
            console.log("requestProducts")
            await mailService.sendRequestProducts(process.env.ADMIN_EMAIL, body) 
                .then(data => {
                    response = true
                    console.log(data)
                })
                .catch(err => {
                    response = false
                    console.log(err)
                })

            return res.json(response)
        }catch(e) {
            return next(res.json( { error: 'Ошибка метода requestProducts!' } ))
        }
    }

}

module.exports = new mailController()