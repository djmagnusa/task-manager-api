const express = require('express')
require('./db/mongoose')
// const User = require('./models/user')
// const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
//const port = process.env.PORT || 3000

const port = process.env.PORT


// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         //if (!file.originalname.endsWith('.pdf')) { //when it is not a pdf
          
//         if(!file.originalname.match(/\.(doc|docx)$/)) {  //match is for regular expressions
//             return cb(new Error('Please upload a Word document'))    //return to stoop the function execution
//         }

//         cb(undefined, true)

//         // cb(new Error('File must be a PDF'))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })

// // const errorMiddleware = (req, res, next) => {
// //     throw new Error('From my middleware')
// // }

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => { //this function needs to have this set of arguments. Thats what let express know that this is the function set up to handle any uncaught errors
//     res.status(400).send({ error: error.message })
// })

//Express middleware
// app.use((req, res, next) => { //next is called to signal to Express that the middleware function is done.
//     //console.log(req.method, req.path)
    
//     if(req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next() //letting express knw that we're done with this middleware function
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json()) //will automatically parse incoming json to an object so we can access it in our request handlers
app.use(userRouter)
app.use(taskRouter)

// const router = new express.Router()

// router.get('/test', (req, res) => {
//     res.send('This is from my other router')
// })

// app.use(router) //registering new route with the express applicatio 

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const bcrypt = require('bcryptjs')

// const jwt = require('jsonwebtoken')

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5ffac9783a0b9235b0d3d9fb')
//     // await task.populate('owner').execPopulate() //to populate data from a relationship
//     // //it will find the user associated with this task and task.owner will now be their profile or entire doucment and not just being the id
    
//     // console.log(task.owner)

//     const user = await User.findById('5ffac4f8b107f83474df1933')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
     
// }

// main()

// const myFunction = async() => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days'})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
//     // const password = 'Red12345!'
//     // const hashedPassword = await bcrypt.hash(password, 8)  //.hash returns a promise

//     // console.log(password)
//     // console.log(hashedPassword)

//     // const isMatch = await bcrypt.compare('red12345!', hashedPassword)
//     // console.log(isMatch)
// }

// myFunction()

// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function () {
//     // console.log(this)
//     // return this
//     return {}
// }

// console.log(JSON.stringify(pet))

