const router = require('express').Router()
const { Category } = require('../models/categoryModel')


router.get('/', async (req, res) => {
    try{
        const categories = await Category.find()
        res.json(categories)
    }
    catch(err){
        res.json({massage : err})
        console.log(err)
    }
})  

module.exports = router;