const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log(mongoUrl)
        console.log('error while connecting to MongoDB:', error.message)
    })

app.use(middleware.tokenExtractor)
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)


module.exports = app

