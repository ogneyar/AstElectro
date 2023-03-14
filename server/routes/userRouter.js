const Router = require('express')

const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
// const registrationMiddleware = require('../middleware/registrationMiddleware')

const router = new Router()


if (process.env.URL === "http://localhost:5000") {
    router.get('/retry_mail/:id', userController.retryMail)
}

// router.post('/registration', registrationMiddleware, userController.registration)
router.post('/create_guest', userController.createGuest)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/activate/:link', authMiddleware, userController.activate)
router.post('/retry_mail/:id', authMiddleware, userController.retryMail)
router.post('/forgot_password', userController.forgotPassword)
router.post('/change_password', userController.changePassword)
router.get('/info', authMiddleware, userController.info)
router.get('/refresh', userController.refresh)
router.put('/update/:id', authMiddleware, userController.update)


module.exports = router