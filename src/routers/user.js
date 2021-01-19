const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require ('../emails/account')
const router = new express.Router()

// router.get('/test', (req, res) => {
//     res.send('From a new file')
// })

router.post('/users', async (req, res) => {   //post http method is used to create
    // console.log(req.body) //to grab incoming body data
    // res.send('testing!')

    const user = new User(req.body) //req coming from postman. req.body is the object which contains the properties we are trying to set up

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken() 
        // res.status(201).send(user)
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
 
    
    // user.save().then(() => {
    //     res.status(201).send(user) //to give clear information we are using status code here also
    // }).catch((e) => {
    //     res.status(400).send(e) //changing status to 400 to make the postman show correct status code. Here, 400 for bad request if the password is not valid or something    
    // })
}) 

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)  //creating our own function
        const token = await user.generateAuthToken()
        res.send({ user: user, token: token}) //using short hand syntax
    } catch(e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req, res) => {  //oony if the middleware calls the next functiono then only it is ever ging to run route handler
    
    res.send(req.user)
    
    // try{
    //     const users =await User.find({}) //saving all users in 'users'
    //     res.send(users)
    // }catch (e) {
    //     res.status(500).send()
    // }
    
    
    // User.find({}).then((users) => { //as we are leaving it as empty object, it is going to fetch all users stred in the database.

    //     res.send(users) //res.send is used to send the response back to like postman

    // }).catch((e) => {
    //     res.status(500).send()
    // })

})
 
//watch resource reading endpoints part 1 
// router.get('/users/:id', async (req, res) => {
   
//     const _id = req.params.id //_id will get the the id that is in the path /users/id_no
   
//     try{
//         const user= await User.findById(_id)

//         if(!user) { //if user doesn't exist with that id
//             return res.status(404).send()
//         }

//         res.send(user) //if user exist with that id
    
//     } catch (e) {
//         res.status(500).send()
//     }


    //mongodb automatically converts string id to normal id
    // User.findById(_id).then((user) => { //User.findById(_id) will difinately search for the id stored in _id but we donot knowo if then((user)) will work as the id may not be there. So applying some conditional logic

    //     if(!user){
    //         return res.status(404).send()
    //     }

    //     //if it find a user's id matched with _id

    //     res.send(user)

    // }).catch((e) => {
    //     res.status(500).send()
    // })
    // console.log(req.params) //params contains all of the route parametrs that are provided
//})

router.patch('/users/me', auth, async (req, res) => { //patch request method is mainly for updating

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age'] //anthing except these will be consideered invalid to be updated like height etc

    const isValidOperation = updates.every((update) => {  //every is going to run for every item in the array
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }


    try {
        //const user = await User.findById(req.params.id)

        //updates is an array of strings so forEach will run for every string in updates. So 'update' will be a string
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}) //new makes sure that the modified document is retured, and runValidators ensures that validation is dnoe befre updating anything like name
        
        // if(!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => { //delete method is mainly used for deleting
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
    
        // if(!user){
        //     return res.status(404).send()
        // }

        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})   

const upload = multer({
   // dest: 'avatars', //if we dont use this it will pass the data through to our function so we can do something with it 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    
    //saving binary data of image to avatar field of user
    req.user.avatar = buffer   //buffer contains a buffer of all the binary data for that file 
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save() 
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(400).send()
    }
})


module.exports = router