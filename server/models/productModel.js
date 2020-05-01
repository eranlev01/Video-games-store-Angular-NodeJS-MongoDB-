const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    category:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    price:{
        type: Number,
        required: true
    },
    productImage:{
        type: String,
        required: true
    }
},
{
    versionKey:false
})

const Product = mongoose.model("products",  productSchema)

module.exports = { Product }