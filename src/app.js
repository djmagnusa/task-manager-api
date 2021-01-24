const express = require('express')
require('./db/mongoose')
// const User = require('./models/user')
// const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
//const port = process.env.PORT || 3000

// const port = process.env.PORT

app.use(express.json()) //will automatically parse incoming json to an object so we can access it in our request handlers
app.use(userRouter)
app.use(taskRouter)

module.exports = app