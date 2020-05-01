const router = require('express').Router()
const { Order } = require('../models/orderModel')
const onlyUser = require('../onlyUser')

//Get All Orders 
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
        res.json(orders)
    }
    catch (err) {
        console.log(err)
    }
})
//Get Order By User Id
router.get('/:id', onlyUser, async (req, res) => {

    const { id } = req.params

    try {
        const order = await Order.find({ "user": id }).populate('users')
        res.json(order)
    }
    catch (err) {
        console.log(err)
    }
})
//Add Order 
router.post('/', onlyUser, async (req, res) => {
    const order = await new Order(req.body)
    try {
        const savedOrder = await order.save()
        res.json(savedOrder)
    }
    catch (err) {
        res.json({ message: err })
    }
})
//Delete Order By User Id 
router.delete('/:id', onlyUser, async (req, res) => {
    const { id } = req.params
    try {
        console.log(id)
        const deletedOrder = await Order.remove({ "user": id }).populate('users')
        res.json(deletedOrder)
        console.log(deletedOrder)
    }
    catch (err) {
        res.json({ message: err })
        console.log(err)
    }
})


module.exports = router;