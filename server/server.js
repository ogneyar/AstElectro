
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const favicon = require('serve-favicon')
const xmlparser = require('express-xml-bodyparser')

const sequelize = require('./db')
const routerApi = require('./routes/index')
const routerOthers = require('./routes/others/index')
const errorHandler = require('./middleware/errorHandlingMiddleware')

const PORT = process.env.PORT || 5000
const CORS_URL = process.env.CORS_URL || "http://astelectro.ru"
const CORS_URL_SECURE = process.env.CORS_URL_SECURE || "https://astelectro.ru"

let whitelist = [
    CORS_URL, CORS_URL_SECURE, 
	'http://localhost:3000', 'http://www.localhost:3000',
    'http://www.astelectro.ru', 'https://www.astelectro.ru'
]
let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true, credentials: true } 
    } else {
        corsOptions = { origin: false } 
    }
    callback(null, corsOptions) 
}

const app = express()
// app.use(cors({ origin: CORS_URL }))
app.use(cors(corsOptionsDelegate))
app.use(express.json({limit: '50mb'}))
app.use(express.raw({limit: '50mb'})) // for binary files
// app.use(express.text({limit: '50mb'}))
// app.use(express.urlencoded({ extended: true }))
app.use(xmlparser())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static'))) 
app.use(favicon(path.join(__dirname,'static','favicon.ico')))
app.use(fileUpload({}))
app.use('/api', routerApi)
app.use('/', routerOthers)

// Обработка ошибок, последний middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync() 
        app.listen(PORT, () => console.log(`Server run: http://localhost:${PORT}`))
    }catch (e) {
        console.log(e)
    }
}

start()
