//This file can be deleted, it is a playground kind of file**

// CRUD - create read update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient //gives access to the function necessary to connect to the database
// const ObjectID = mongodb.ObjectID

//using destructuring to grab things from mongo db

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID() //new keyword is optional
console.log(id)
console.log(id.id.length) //gives the binary data and .length to check the length 
// console.log(id.getTimestamp())
console.log(id.toHexString().length) //to see the length of  string representation

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error){
      return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName) //now we can use 'db' to manipulate our database

    // db.collection('users').insertOne({
    //     _id: id, //generating our own id for the document
    //     name: 'Vikram',
    //     age: 26
    // }, (error, result) => {  //this function will be called when insertion is complete
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }

    //     console.log(result.ops) //ops is an array of doucments

    // })

//     db.collection('users').insertMany([
//         {
//             name: 'Jen',
//             age: 28
//         }, {
//             name: 'Gunther',
//             age: 27
//         }
//     ], (error,result) => {
//         if(error){
//             return console.log('Unable to insert documents!')
//         }

//         console.log(result.ops)
//     })

        // db.collection('tasks').insertMany([
        //     {
        //         description: 'Clean the house',
        //         completed: true
        //     }, {
        //         description: 'Renew inspection',
        //         completed: false
        //     }, {
        //         description: 'Pot plants',
        //         completed: false
        //     }
        // ], (error,response) => {
        //     if(error){
        //         return console.log('Unable to insert tasks!')
        //     }

        //     console.log(response.ops)
        // })

        // db.collection('users').findOne({_id: new ObjectID("5fc3fee44bfcb24db07c1eed")}, (error, user) => {
        //     if(error){
        //         return console.log('Unable to fetch')
        //     }

        //     console.log(user)

        // })

        // db.collection('users').find({ age: 27 }).toArray((error, users) => {
        //     console.log(users)
        // })

        // db.collection('users').find({ age: 27 }).count((error, count) => {
        //     console.log(count)
        // })

        // db.collection('tasks').findOne({ _id: new ObjectID("5fc3fba2718346288430e87c")}, (error,task) => {
            
        //     console.log(task)

        // })

        // db.collection('tasks').find({ completed: false}).toArray((error,tasks) => {
        //     console.log(tasks)
        // })

    //    db.collection('users').updateOne({
    //         _id: new ObjectID("5fc3e59c9bb82c6338bb764c")
    //     }, {
    //         // $set: {
    //         //     name: 'Mike'
    //         // }
    //         $inc: {
    //             age: 1 //incrementing the age by one
    //         }
    //     }).then((result) => {
    //         console.log(result)
    //     }).catch((error) => {
    //         console.log(error)
    //     })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').deleteMany({
    //     age: 27
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description: 'Clean the house'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

})
