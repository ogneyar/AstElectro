const Router = require('express')
const router = new Router()
const milwaukeeController = require('../../controllers/parser/milwaukeeController')
const checkRole = require('../../middleware/checkRoleMiddleware')



router.post('/', checkRole('ADMIN'), milwaukeeController.milwaukee) // добавление новых товаров и обновление цен

if (process.env.URL === "http://localhost:5000") {
    router.get('/', milwaukeeController.milwaukee) // добавление новых товаров и обновление цен

    // router.get('/add_new_product', milwaukeeController.addNewProduct) // добавление товаров (старый роут)
}

// router.post('/add_new_product', checkRole('ADMIN'), milwaukeeController.addNewProduct) // добавление товаров (старый роут)

router.get('/add_urls', checkRole('ADMIN'), milwaukeeController.addUrls) // добавления ссылок в файл

// router.get('/get_all', checkRole('ADMIN'), milwaukeeController.getAll) // получение всех данных о товаре



module.exports = router