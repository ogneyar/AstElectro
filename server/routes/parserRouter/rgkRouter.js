const Router = require('express')
const router = new Router()
const rgkController = require('../../controllers/parser/rgkController')
const checkRole = require('../../middleware/checkRoleMiddleware')



if (process.env.URL === "http://localhost:5000" || process.env.URL === process.env.URL_SPH) {
    router.get('/', rgkController.rgk) // парсер RGK
    router.get('/add_sizes', rgkController.addSizes) // добавление габаритов RGK
}else {
    router.get('/', checkRole('ADMIN'), rgkController.rgk) // парсер RGK
    router.get('/add_sizes', checkRole('ADMIN'), rgkController.addSizes) // добавление габаритов RGK
}



module.exports = router