const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'products',
        required: true
    },
    quantity:Number,
    total_price:Number,
    cart:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
},{
    versionKey: false
})

const CartItem = mongoose.model("cartItems",  cartItemSchema)

module.exports = { CartItem }