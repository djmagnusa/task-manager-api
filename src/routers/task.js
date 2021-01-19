const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/tasks', auth, async (req,res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body, //copies all of the prperties from body over to this object
        owner: req.user._id //owner is talking the "object ID"
    })
    
    try{
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    }

    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20  //limit allows us to limit no of results we get back for any given request and skip allows us to iterate over the pages and the data to be skipped
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res) => {
    
    const match = {}
    const sort = {}

    if(req.query.completed){ //if completed was provided
        match.completed = req.query.completed === 'true'   //since the true in query is a string and not a boolean true
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')  //spltting the sortBy query
        sort[parts[0]] = part[1] === 'desc' ? -1 : 1  //sort will get -1 if query string is desc otherwise 1
    }

    try{
        //const tasks = await Task.find({ owner: req.user._id })
        
        //or doing the same using populate

        //await req.user.populate('tasks').execPopulate()
        
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),   //since query contains string and not atual integers
                skip: parseInt(req.query.skip),
                // sort: {
                //    // createdAt: 1   //1 for ascending and -1 for descending
                //     completed: 1
                // }
                sort: sort
            }
        }).execPopulate()
        
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send(e)
    }
    
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)

        const task = await Task.findOne({ _id: _id, owner: req.user._id })

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()

    }

    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send();
    // })
})

router.patch('/tasks/:id', auth, async (req, res) =>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))  //as it is a return statement we can write in the same line

    if(!isValidOperation){
        res.status(400).send({ error: 'Invalid updates!'})
    }

    try{
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        
        


        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!task){
           return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
   //     const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})
        
        if(!task){
            res.status(404).send()
        }

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
}) 

module.exports = router