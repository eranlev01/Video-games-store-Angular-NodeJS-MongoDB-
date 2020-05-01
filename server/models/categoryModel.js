const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    id:Number,
    name:String
},
{
    versionKey:false
})

const Category = mongoose.model("categories",  categorySchema)

module.exports = { Category }