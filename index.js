const express = require('express')
const mongoose = require('mongoose')

const app = express()

// Connection to mongodb

mongoose.connect("mongodb://localhost:27017/ddapp").then(()=> console.log("Mongo connected succesfully")).catch((error) => console.log (error))















const PORT = 4000

app.listen(PORT , ()=> console.log(`Running on port ${PORT}`))

