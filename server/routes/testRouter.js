const Router = require('express')
const router = new Router()
// const testController = require('../controllers/testController')
const ApiError = require('../error/apiError')


const testPost = async (req, res, next) => {
    try {
        const {name} = req.body
        let response = {
            "test":"post",
            "name":name
        }

        return res.json(response) // return array
    }catch(e) {
        return next(ApiError.badRequest('Ошибка метода testPost!'));
    }
}

const testGet = async (req, res, next) => {
    try {
        // const {name} = req.body
        let obj = { 
            ok: true,
            result: {
                id: 42,
                first_name: "her",
                username: "o"
            }
        }
        obj = { ...obj, result: { article: "t142", url: "http://her.com", price: 42} }
        return res.json(obj) // return object
        // return res.json([{"test":"get"}]) // return array
    }catch(e) {
        return next(ApiError.badRequest('Ошибка метода testGet!'));
    }
}
 
router.post('/', testPost)

router.get('/', testGet)

// router.delete('/:id', brandController.delete)
// router.put('/:id', brandController.edit)



module.exports = router