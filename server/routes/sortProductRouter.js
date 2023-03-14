// sortProductRouter

const Router = require('express')
const router = new Router()

const sortProductController = require('../controllers/sortProductController')
// const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), sortProductController.setAll)
if (process.env.URL === "http://localhost:5000") {
    router.get('/set_all', sortProductController.setAll) 
}
router.get('/', sortProductController.getAll)


module.exports = router