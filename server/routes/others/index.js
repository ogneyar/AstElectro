
const Router = require('express')
const router = new Router()
const path = require('path')


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'welcome.html'))
})

router.get('/echo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'echo.json'))
})

router.get('/undefined', (req, res) => {
    res.status(200).send("")
})


module.exports = router
