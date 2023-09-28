
const { default: axios } = require('axios')
const mailService = require('../service/mailService')


class mailController {
    
    async requestPrice(req, res, next) {
        try {
            let body = req.body
            if (!body) body = req.query
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
            if (!body || body.name === undefined) body = req.query
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
            if (!body || body.name === undefined) body = req.query
            let response
            body = {
                ...body,
                email_from: process.env.SMTP_USER,
                to_admin: process.env.ADMIN_EMAIL,
                to_seo: process.env.SEO_EMAIL
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
    
    async callbackL(req, res, next) {
        try {
            let body = req.body
            if (!body || body.name === undefined) body = req.query
            let response
            body = {
                ...body,
                email_from: process.env.SMTP_USER,
                to_admin: process.env.ADMIN_EMAIL,
                to_seo: process.env.SEO_EMAIL
            }
            await axios.post(process.env.API_URL_L + "api/mail/callback_ast", body)
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
            return next(res.json( { error:  `Ошибка метода callbackL! ${e}` } ))
        }
    }
    
    async sendMessageL(req, res, next) {
        try {
            let body = req.body // { to_seo, subject, html } // to_seo - необязателен
            if (!body || body.subject === undefined) body = req.query 

            let response

            let to = [ process.env.ADMIN_EMAIL ]
            if (body.to_seo) to.push(process.env.SEO_EMAIL)

            body = {
                email_from: process.env.SMTP_USER, // от кого
                to, // кому
                subject: body.subject, // тема письма
                html: body.html // тело письма
            }
                        
            await axios.post(process.env.API_URL_L + "api/mail/send_message_ast", body)
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
            return next(res.json( { error: `Ошибка метода sendMessageL! ${e}` } ))
        }
    }

}

module.exports = new mailController()