const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')


const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log(mongoUrl)
        console.log('error while connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app

