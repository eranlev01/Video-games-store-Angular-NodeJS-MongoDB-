const router = require('express').Router()
const { Product } = require('../models/productModel')
const multer = require('multer')
const onlyAdmin = require('../onlyAdmin')
const onlyUser = require('../onlyUser')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    // Reject A File
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, false)
    } else {
        cb(null, true)
    }

}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

//Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category')
        res.json(products)
    }
    catch (err) {
        res.json({ message: err })
    }
})
//Get All Products By Category
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const products = await Product.find({ 'category': id }).populate('category')
        res.json(products)
    }
    catch (err) {
        res.json({ message: err })
    }

})
//Search Product
router.get('/products-by-name/:name', async (req, res) => {

    try {
        const { name } = req.params
        const products = await Product.find({ 'name': { $regex: `${name}`, $options: "i" } }).populate('category')
        res.json(products)
    }
    catch (err) {
        res.json({ message: err })
    }

})
//Add Product
router.post('/', upload.single('productImage'),  async (req, res) => {
    console.log(req.file.path, req.body)
    const product = await new Product({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        productImage: req.file.path
    })
    try {
        const savedProduct = await product.save()
        const newProductList = await Product.find()
        console.log(savedProduct)
        res.json(newProductList)
        console.log(newProductList)
        console.log('suc')

    }
    catch (err) {
        console.log('err')
        console.log(err)
        res.json({ message: err })
    }
})
//Edit Product
router.put('/:id', onlyAdmin, async (req, res) => {
    const { id } = req.params
    const { name, category, price, imgPath } = req.body
    try {
        const updated = await Product.updateOne({ '_id': id }, { 'name': name, 'category': category, 'price': price, 'imgPath': imgPath })
        const products = await Product.find()
        res.json(products)
    }
    catch (err) {
        res.json({ message: err })
        console.log(err)
    }
})

module.exports = router;