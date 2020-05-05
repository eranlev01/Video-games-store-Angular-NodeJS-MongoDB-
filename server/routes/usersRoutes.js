const router = require('express').Router()
const { User } = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    }
    catch (err) {
        res.json({ message: err })
    }
})
//Get User By ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const users = await User.find({'_id': id})
        res.json(users)
    }
    catch (err) {
        res.json({ message: err })
    }
})
//Add New User
router.post('/', async (req, res) => {
    const user = await new User(req.body)
    const { _id } = req.body
    const userValid = await User.find({_id})
    try {
        if (userValid.length){
            res.send('ID already exist')
        }
        else {
            const salt = await bcrypt.genSaltSync(10)
            user.password = await bcrypt.hashSync(user.password, salt)
            const savedUser = await user.save()
            res.json(savedUser)
        }
    }
    catch (err) {
        res.json({ message: err })
    }
})
//Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (email && password) {
        try {
            const user = await User.find({ email })
            if (user[0]) {
                if (bcrypt.compareSync(password, user[0].password)) {

                    jwt.sign({ email, isAdmin: user[0].isAdmin }, "play_with_us", { expiresIn: "30m" },
                        (err, token) => {
                            if (err) {
                                res.sendStatus(500)
                                throw err
                            }
                            res.json({ token, user })

                        })
                }
                else {
                    res.status(400).send("Wrong password")
                }
            }
            else {
                res.status(400).send("User not found")
            }
        }
        catch (err) {
            res.json({ message: err })
        }

    }
    else {
        res.status(400).send("missing some info")
    }
})

module.exports = router;