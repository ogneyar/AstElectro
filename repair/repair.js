const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')

const port = 3000

const app = express()

app.use(express.static(path.resolve(__dirname, 'static')))
app.use(favicon(path.join(__dirname,'favicon.ico')))


app.get('*', (req, res) => res.sendFile(__dirname + '/index.html'))
	
app.listen(port, () => console.log(`Starting server. http://localhost:${ port }`))
