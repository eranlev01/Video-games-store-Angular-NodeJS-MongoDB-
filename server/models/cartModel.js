const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.Number,
        ref: 'users',
        required: true
    },
    creation_date:{
        type: Date,
        default: Date.now
    },
    status: String
},
{
    versionKey: false
})

const Cart = mongoose.model("carts",  cartSchema)

module.exports = { Cart }