const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id:{
        type: Number,
        required : true
    },
    f_name:{
        type: String,
        required: true
    },
    l_name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    street:{
        type:String,
        required: true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }  
},
{
    versionKey:false
})

const User = mongoose.model("users",  userSchema)

module.exports = { User }