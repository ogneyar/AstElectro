require('dotenv').config()
const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: process.env.DB,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialectOptions: {
            charset: 'utf8mb4'
        },
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
        //logging: false
        logging: true
		// logging: console.log
    }
)