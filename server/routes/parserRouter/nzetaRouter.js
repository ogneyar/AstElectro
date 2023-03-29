
const Router = require('express')
const router = new Router()
const nzetaController = require('../../controllers/parser/nzetaController')
const checkTokenUpdates = require('../../middleware/checkTokenUpdates')


if (process.env.URL === "http://localhost:5000") {
    router.get('/', nzetaController.nzetaAPI) // 
    // router.get('/', nzetaController.nzeta) //
    router.get('/parse', nzetaController.parseNzetaRu) //
}
router.post('/', checkTokenUpdates(), nzetaController.nzetaAPI) // 
// router.post('/', checkTokenUpdates(), nzetaController.nzeta) // 
router.post('/parse', checkTokenUpdates(), nzetaController.parseNzetaRu) // 



module.exports = router