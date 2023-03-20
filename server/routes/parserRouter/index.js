
const Router = require('express')
const router = new Router()


const nzetaRouter = require('./nzetaRouter')



router.use('/nzeta', nzetaRouter) // nzeta



module.exports = router
