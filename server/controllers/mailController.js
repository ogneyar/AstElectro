
const { default: axios } = require('axios')
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
            if (!body || body === {} || body.name === undefined) body = req.query
            let response
            // console.log("requestProducts")
            // console.log(body)
            await mailService.sendRequestProducts(process.env.ADMIN_EMAIL, body) 
                .then(
                    data => {
                        response = true
                        console.log(data)
                    },
                    error => {
                        response = false
                        console.log(error)
                    }
                )
                .catch(err => {
                    response = false
                    console.log(err)
                })

            return res.json(response)
        }catch(e) {
            return next(res.json( { error: 'Ошибка метода requestProducts!' } ))
        }
    }
    
    
    async requestProductsL(req, res, next) {
        try {
            let body = req.body
            if (!body || body === {} || body.name === undefined) body = req.query
            let response
            body = {
                ...body,
                email_from: process.env.SMTP_USER
            }
            await axios.post(process.env.API_URL_L + "api/mail/request_products_ast", body)
                .then(
                    data => {
                        response = true
                        console.log(data.data)
                    },
                    error => {
                        response = false
                        console.log(error)
                    }
                )
                .catch(err => {
                    response = false
                    console.log(err)
                })

            return res.json(response)
        }catch(e) {
            return next(res.json( { error: 'Ошибка метода requestProductsL!' } ))
        }
    }

}

module.exports = new mailController()