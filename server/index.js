const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const authRouter = require('./routes/auth.router')
const app = express()
const PORT = config.get('PORT')

app.use(express.json())
app.use('/api/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(config.get('dataBaseUrl'))
        app.listen(PORT, () => console.log(PORT))
    } catch (e) {

    }
}

start()
