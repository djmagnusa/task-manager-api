const mongoose = require('mongoose')
// const validator = require('validator')

//mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {     //in mongoose we provide the databse name with the url. So task-manager-api will be made
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true, //makes sure our index is created    
    useFindAndModify: false //this will adress the deprecation warning
})



// const me = new User({ //creating instance of the model
//     name: '   Andrew    ',
//     email: 'MYEMAIL@MEAD.IO   ',
//     password: 'phone098!'
// })

// me.save().then(()=>{ //saving instance to the database
//     console.log(me)
// }).catch((error) => {
//     console.log('Error!', error)
// })




// const Task = mongoose.model('Task', { //mongo automatically changes the collection name to lower case
//     description: {
//         type: String,
//         required: true,
//     },
//     completed: {
//         type: Boolean,
//         default: false 
//     }
// })

// const task = new Task({
//    description: '   Eat lunch'
// })

// task.save().then(() =>{
//     console.log(task)
// }).catch((error) => {
//     console.log(error)
// })