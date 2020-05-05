const router = require('express').Router()
const onlyUser = require('../onlyUser')
const onlyAdmin = require('../onlyAdmin')
const { User } = require('../models/userModel')
const { Category } = require('../models/categoryModel')
const { Product } = require('../models/productModel')

router.get('/', async (req, res) => {

    const user = await new User({
        "_id" : 202202202,
        "isAdmin" : true,
        "f_name" : "Eran",
        "l_name" : "Lev",
        "email" : "eranlev1996@gmail.com",
        "password" : 1234,
        "city" : "Ashdod",
        "street" : "Rogozin"
    })
    const category = await new Product({
        name: 'FPS Games',
    })
    await new Product({
        name: 'Sport Games',
    })
    await new Product({
        name: 'Fantasy Games',
    })
    const product = await new Product({
        name: 'FIFA 20',
        category: req.body.category,
        price: req.body.price,
        productImage: req.file.path
    })
    try {     
            await bcrypt.genSaltSync(10)
            await bcrypt.hashSync(user.password, salt)
            await user.save() 
            await category.save()
            await product.save()
            res.send('ok')
           
    }
    catch (err) {
        console.log(err)
        res.json({ message: err })
    }
    
})


module.exports = router;