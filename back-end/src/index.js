const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()

const database = require('./config')

// define main app
const app = express()

// url logger : GET /api/students
// custom middleware
function urlRequestLogger (req, res, next) {
    console.log(`${req.method} : ${req.url}`)
    next()
}

// config middleware
app.use(express.json())
app.use(cors({ exposedHeaders : 'UID' })) //yg dikasih liat apa aja
app.use(urlRequestLogger)
app.use(express.static('public'))

// test database connection
database.connect((error) => {
    if (error) {
        console.log('error : ', error)
    }
    console.log(`database is connected, threadId : ${database.threadId}.`)
})

// define main route
app.get('/', (req, res) => res.status(200).send('<h1>Welcome to My RESTAPIs</h1>'))

// setup routes
const routers = require('./routers')
app.use('/api', routers.user_routers)

// binding to local port
const PORT = 5000
app.listen(PORT, () => console.log(`API is running at port : ${PORT}.`))