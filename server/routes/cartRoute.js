const router = require('express').Router()
const { Cart } = require('../models/cartModel')
const onlyUser = require('../onlyUser')

//Get Cart By User Id
router.get('/:id', onlyUser, async (req, res) => {

    const { id } = req.params

    try {
        const cart = await Cart.find({ "user": id }).populate('users')
        res.json(cart)
    }
    catch (err) {
        console.log(err)
    }
})
//Add Cart 
router.post('/', onlyUser, async (req, res) => {
    const cart = await new Cart(req.body)
    try {
        const savedCart = await cart.save()
        const carts = await Cart.find()
        res.json(carts)
    }
    catch (err) {
        console.log(err)
        res.json({ message: err })
    }
})
//Delete Cart By User Id 
router.delete('/:id', onlyUser, async (req, res) => {

    try {
        const { id } = req.params
        console.log('id:', id)
        const cart = await Cart.deleteOne({ "user": id }).populate('users')
        const newCart = await Cart.find({"user": id}).populate('users')
        res.json(newCart)
        console.log('cart', cart)
        console.log('newCart', newCart)
    }
    catch (err) {
        console.log('err')
        console.log(err)
    }
})



module.exports = router;