const router = require('express').Router()
const { CartItem } = require('../models/cartitemModel')
const onlyUser = require('../onlyUser')

// Get All CartItems
router.get('/', async (req, res) => {
    try {
        const cartItem = await CartItem.find()
        res.json(cartItem)
    }
    catch (err) {
        res.send(err)
    }
})
// Get CartItems By Cart ID
router.get('/:id', async (req, res) => {

    const { id } = req.params
    try {
        const cartItems = await CartItem.find({ 'cart': id }).populate('cart').populate('product')
        res.json(cartItems)
        
    }
    catch (err) {
        res.send(err)
    }
})
// add cartItem 
router.post('/', async (req, res) => {
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
//Remove All CartItems By Cart ID
router.delete('/by-cart/:id', async (req, res) => {

    const { id } = req.params
    try {
        await CartItem.deleteMany({ 'cart': id }).populate('carts')
        const newCartItemList = await CartItem.find()
        res.json(newCartItemList)
    }
    catch (err) {
        res.send(err)
    }
})
//Remove CartItem by Id
router.delete('/:id', async (req, res) => {

    const { id } = req.params
    try {
        const deletedCartItem = await CartItem.deleteOne({ '_id': id })
        const newCartItemList = await CartItem.find()
        res.json(newCartItemList)

    }
    catch (err) {
        res.send(err)
    }
})


module.exports = router;