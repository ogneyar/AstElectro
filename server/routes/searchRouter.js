const Router = require('express')
const router = new Router()
const searchController = require('../controllers/searchController')


router.post('/', searchController.value) 
router.get('/', searchController.value) 

router.post('/article', searchController.article) 
router.get('/article', searchController.article) 

router.post('/name', searchController.name) 
router.get('/name', searchController.name) 


module.exports = router
