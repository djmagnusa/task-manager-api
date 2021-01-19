const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String, //using constructor functions of javascript for value of type
        required: true, //providing name is now necessary
        trim: true //removes any extra space in name (if any)
    },
    email: {
        type: String,
        unique: true, //creates an index in mongodb database to guarantee uniqueness
        required: true,
        trim: true,
        lowercase: true, //to convert the email to lowercase 
        validate(value){ //value represents the value given to the email while creatign instance of te model
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7, //length should be minimum 7
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){  //first converting the password t lowercase as if its Password with captital P then includes method won't work
                throw new Error('Passwrd cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0, //if age is not provided it will be set to 0
        validate(value) { //making our wn validation
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer //this will allow us to store the buffer with our binary image data right in the database alongside of the user who the image belongs to
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', { //this is not stored in the database. It is just for mongoose to know who knows what and how they are related
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

//for hiding private data from the token array
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//our methods are accessible on the instances sometimes called instance methods
userSchema.methods.generateAuthToken = async function() { //fr individual user
    const user = this
   // const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
   
   const token = jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}


//static methds are accssible on the model somtimes called model methods
userSchema.statics.findByCredentials = async (email, password) => { //for user model
    const user = await User.findOne({ email: email }) //finding user by its id

    if(!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password) //compare given password with the hashed password in the database
    
    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//running some code before the user is saved
//this is will be used before user.save()
//after using the we cannot use findByIdAndUpdate. We have to modify that code
// Hash the plain text password before saving
userSchema.pre('save', async function(next) { //pre to do something before and post to do somethiing after
    const user = this

    if (user.isModified('password')) {  //this will be true if the user is first created or updated and passwrd was one of the things changed
        user.password = await bcrypt.hash(user.password, 8)
    }

    // console.log('just before saving')

    next() //to pass the request to the next middleware function. Otherwise, the request will be left hanging. So to tell mongoose know that wwe are done with request, we can use next()
}) 

// Delete user tasks when user is removed
// this runs before removing
userSchema.pre('remove', async function (next) {
    const user = this 
    await Task.deleteMany({ owner: user._id })
    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User