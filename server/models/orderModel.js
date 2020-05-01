const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.Number,
        ref: 'users',
        required: true
    },
    items:Array,
    order_price:Number,
    city:String,
    street:String,
    credit_card:String,
    shipping_date:Date,
    order_date:{
        type: Date,
        default: Date.now
    },
    creditCardFourLastNumbers:Number
},
{
    versionKey: false
})

const Order = mongoose.model("orders",  orderSchema)

module.exports = { Order }