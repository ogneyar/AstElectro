const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')

const port = 3000

const app = express()

app.use(express.static(path.resolve(__dirname,'build')))
app.use(favicon(path.join(__dirname,'build','favicon.ico')))

app.get('/error', (req, res) => res.status(404).sendFile(__dirname + '/build/404.html'))

app.get('*', (req, res) => res.sendFile(__dirname + '/build/index.html'))
	
app.listen(port, () => console.log(`Starting server. http://localhost:${ port }`))