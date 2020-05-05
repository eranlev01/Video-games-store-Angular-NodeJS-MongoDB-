const router = require('express').Router()
const onlyUser = require('../onlyUser')

// Documentation

const post_documentation = [
    {
        description: "Create new user",
        method_Path: "POST - /users",
        request_response: "Request:{'f_name' : 'Eran', 'l_name' : 'Lev', 'email' : 'eranlev1996@gmail.com', 'password' : '1234', 'city' : 'Ashdod', 'street' : 'Rogozin'} Response: {success: true, data:[{id:1}]}"
    },
    {
        description: "Login and check if user is already exist + hashing his password",
        method_Path: "POST - /user/Login",
        request_response: "Request:{'email':'eranlev1996@gmail.com', 'password': '1234'} Response: {success: true, data:[{id:1}]}"
    },
    {
        description: "Create new product",
        method_Path: "POST - /products",
        request_response: "Request:{name: COD - MW, category: 1, price: 55, picture:...} Response: {success: true, data:[{id:3}]}"
    },
    {
        description: "Edit product by id",
        method_Path: "PUT - /products/1",
        request_response: "Request:{name: COD - MW, category: 1, price: 50, picture:...} Response: {success: true, data:[{id:3}]}"
    },
    {
        description: "Create new cart",
        method_Path: "POST - /carts",
        request_response: "Request:{'user': '205205205'} Response: {success: true, data:[{id:1}]}"
    },
    {
        description: "Create new cartItem",
        method_Path: "POST - /cartitem",
        request_response: "Request:{'product': '1', 'quantity': '1', 'total_price': '50', 'cart': 1} Response: {success: true, data:[{id:1}]}"
    },
    {
        description: "Create new order",
        method_Path: "POST - /orders",
        request_response: "Request:{'user': '1', 'items': '[name: COD - MW, category: 1, price: 55, picture:...]', 'order_price': '50', 'city': 'Ashdod', 'street' : 'Rogozin', 'credit_card': '4580458045804580', 'shipping_date': '2020-05-09T21:00:00.000+0000'} Response: {success: true, data:[{id:1}]}"
    },
]
const get_documentation = [
    {
        description: "Get all users",
        method_Path: "Get - /users",
        request_response: "Request:{} Response: {success: true, data:[{'_id' : 205205205, 'isAdmin' : false, 'f_name' : 'Snir', 'l_name' : 'Israel', 'email' : 'snirisrael12@gmail.com', 'password' : '$2b$10$OD6mViJXWYeHMRL4ytJN4unCwglukn6wis/q6sk1H28VcROG.jDSy', 'city' : 'Ashdod', 'street' : 'Rogozin'}...]}"
    },
    {
        description: "Get user by id",
        method_Path: "Get - /users/205205205",
        request_response: "Request:{params: {'id':2052052052}} Response: {success: true, data:[{'_id' : 205205205, 'isAdmin' : false, 'f_name' : 'Snir', 'l_name' : 'Israel', 'email' : 'snirisrael12@gmail.com', 'password' : '$2b$10$OD6mViJXWYeHMRL4ytJN4unCwglukn6wis/q6sk1H28VcROG.jDSy', 'city' : 'Ashdod', 'street' : 'Rogozin'}]}"
    },
    {
        description: "Get all categories",
        method_Path: "GET - /categories",
        request_response: "Request:{} Response: {success: true, data:[{'_id' : ObjectId('5e726dd27c179c47eb821507'), 'name' : 'FPS Games'},{},...]}"
    },
    {
        description: "Get all products",
        method_Path: "GET - /products",
        request_response: "Request:{} Response: {success: true, data:[{'_id' : ObjectId('5e7274c170ce755b6a7566b9'), 'name' : 'Call Of Duty : Modern Warfare', 'category' : ObjectId('5e726dd27c179c47eb821507'), 'price' :65, 'productImage' : 'uploads/COD-MW.jpg'},{},...]}"
    },
    {
        description: "Get product by id",
        method_Path: "GET - /products/5e7274c170ce755b6a7566b9",
        request_response: "Request:{params: {'id':5e7274c170ce755b6a7566b9}} Response: {success: true, data:[{'_id' : ObjectId('5e7274c170ce755b6a7566b9'), 'name' : 'Call Of Duty : Modern Warfare', 'category' : ObjectId('5e726dd27c179c47eb821507'), 'price' : 65, 'productImage' : 'uploads/COD-MW.jpg'}]}"
    },
    {
        description: "Get product by category id",
        method_Path: "GET - /products/5e726dd27c179c47eb821507",
        request_response: "Request:{params: {'id':5e7274c170ce755b6a7566b9}} Response: {success: true, data:[{'_id' : ObjectId('5e7274c170ce755b6a7566b9'), 'name' : 'Call Of Duty : Modern Warfare', 'category' : ObjectId('5e726dd27c179c47eb821507'), 'price' : 65, 'productImage' : 'uploads/COD-MW.jpg'},{},...]}"
    },
    {
        description: "Get product by name",
        method_Path: "GET - /products/call",
        request_response: "Request:{params: {'name':Call}} Response: {success: true, data:[{'_id' : ObjectId('5e7274c170ce755b6a7566b9'), 'name' : 'Call Of Duty : Modern Warfare', 'category' : ObjectId('5e726dd27c179c47eb821507'), 'price' : 65, 'productImage' : 'uploads/COD-MW.jpg'},{},...]}"
    },
    {
        description: "get cart by user id",
        method_Path: "GET - /carts/205205205",
        request_response: "Request:{{params: {'id':205205205}} Response: {success: true, data:[{ '_id' : ObjectId('5eb129896bbaad70549b6781'), 'user' : 205205205, 'creation_date' : '2020-05-05T08:53:29.919+0000'}]}"
    },
    {
        description: "get cartItems by cart id",
        method_Path: "GET - /cartitems/5eb129896bbaad70549b6781",
        request_response: "Request:{{params: {'id':5eb129896bbaad70549b6781}} Response: {success: true, data:[{ '_id' : ObjectId('5eb129b0e16d09705d392871'), 'product' : ObjectId('5e7cbc558446b4246b049d6f'), 'quantity' : 1, 'total_price' : 50, 'cart' : ObjectId('5eb129896bbaad70549b6781')}]}"
    },
    {
        description: "get all orders",
        method_Path: "GET - /orders",
        request_response: "Request:{{} Response: {success: true, data:[{  '_id' : ObjectId('5eabea5855f7a117d399b52d'), 'items' : [{...}], 'user' : 205205205, 'city' : 'Haifa', 'street' : 'ffggg', 'shipping_date' : '2020-05-13T21:00:00.000+0000', 'credit_card' : '5555', 'order_price' : 50, 'order_date' : '2020-05-01T09:22:32.039+0000')},{},...]}"
    },
    {
        description: "get order by user id",
        method_Path: "GET - /orders/205205205",
        request_response: "Request:{{params: {'id':205205205}} Response: {success: true, data:[{  '_id' : ObjectId('5eabea5855f7a117d399b52d'), 'items' : [{...}], 'user' : 205205205, 'city' : 'Haifa', 'street' : 'ffggg', 'shipping_date' : '2020-05-13T21:00:00.000+0000', 'credit_card' : '5555', 'order_price' : 50, 'order_date' : '2020-05-01T09:22:32.039+0000')}]}"
    },
]
const delete_documentation = [
    {
        description: "Delete cart by user id",
        method_Path: "DELETE - /carts/205205205",
        request_response: "Request:{params: {'id':205205205}} Response: {success: true, data:[{id:1}]}"
    },
    {
        description: "Delete cartItem by id",
        method_Path: "DELETE - /caritems/5eb129b0e16d09705d392871",
        request_response: "Request:{{params: {'id':5eb129b0e16d09705d392871}} Response: {success: true, data:[{id:1}]}"
    },
    {
        description: "Delete all cartItems by cart id",
        method_Path: "DELETE - /caritems/5eb129896bbaad70549b6781",
        request_response: "Request:{{params: {'id':5eb129896bbaad70549b6781}} Response: {success: true, data:[{id:1}]}"
    },
   
]
const decomentaion = {
    post_documentation,
    delete_documentation,
    get_documentation
}
// Get Documentation
router.get('/', onlyUser, async (req, res) => {
    try {
        res.json(decomentaion)
    }
    catch (err) {
        console.log(err)
    }
})

module.exports = router;