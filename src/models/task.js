const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({ //mongo automatically changes the collection name to lower case
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false 
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //to create releationship with User model
                    //ref tells which model to use during populate
    }
}, {
    timestamps: true
})


const Task = mongoose.model('Task', taskSchema)

module.exports = Task