const router = require('express').Router()
const { CartItem } = require('../models/cartitemModel')
const onlyUser = require('../onlyUser')

// Get All Items
router.get('/', async (req, res) => {
    try {
        const cartItem = await CartItem.find()
        res.json(cartItem)
    }
    catch (err) {
        console.log(err)
    }
})
// Get Items By Cart ID
router.get('/:id', async (req, res) => {

    const { id } = req.params
    try {
        const cartItems = await CartItem.find({ 'cart': id }).populate('cart').populate('product')
        res.json(cartItems)
        
    }
    catch (err) {
        console.log(err)
    }
})
// add Item 
router.post('/', async (req, res) => {
    console.log('req.body', req.body)
    try {
        const cartItemList = await CartItem.find()
        const duplicatdedItem = cartItemList.find(i => i.product == req.body.product)
        if(duplicatdedItem !== undefined){
            const updated = await CartItem.updateOne({'product': req.body.product},{'quantity' : req.body.quantity + duplicatdedItem.quantity, 'total_price' : req.body.quantity * duplicatdedItem.total_price})
            res.json(updated)
        }
        else{
            const cartItem = await new CartItem(req.body)
            const savedCartItem = await cartItem.save()
            res.json(savedCartItem)
        }

    }
    catch (err) {
        res.json({ message: err })
        console.log(err)
    }
})
//Remove All CartItems By User ID
router.delete('/by-cart/:id', async (req, res) => {

    const { id } = req.params
    try {
        console.log('id-' ,id)
        await CartItem.deleteMany({ 'cart': id }).populate('carts')
        const newCartItemList = await CartItem.find()
        res.json(newCartItemList)
        console.log('deleted:', newCartItemList)
        console.log('new:' ,newCartItemList)
    }
    catch (err) {
        console.log(err)
        console.log('err')
    }
})
//Remove Item by Id
router.delete('/:id', async (req, res) => {

    const { id } = req.params
    try {
        console.log('id' ,id)
        const deletedCartItem = await CartItem.deleteOne({ '_id': id })
        const newCartItemList = await CartItem.find()
        res.json(newCartItemList)
        console.log('deleted:', deletedCartItem)
        console.log('new:' ,newCartItemList)
    }
    catch (err) {
        console.log(err)
        console.log('err')
    }
})


module.exports = router;