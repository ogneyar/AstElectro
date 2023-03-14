const Router = require('express')
const router = new Router()
const parseController = require('../../controllers/parser/parseController')
const checkRole = require('../../middleware/checkRoleMiddleware')

// api/parser/parse
router.get('/mail.ru', parseController.mailRu)
router.get('/ya.ru', parseController.yaRu)


module.exports = router