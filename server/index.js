const express = require('express')

const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost/gamestop",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true
})

const con = mongoose.connection

con.once("open", ()=>{
    console.log("connected to mongo")
    
})
.on("error", (err)=>console.log(err))
app.use('/uploads', express.static('uploads'))

app.use("/api/users", require("./routes/usersRoutes"))
app.use("/api/categories", require("./routes/categoriesRoute"))
app.use("/api/products", require("./routes/productRoute"))
app.use("/api/carts", require("./routes/cartRoute"))
app.use("/api/cartitem", require("./routes/cartitemRoute"))
app.use("/api/orders", require("./routes/ordersRoute"))

app.listen(1001, () => console.log('server runs on http://localhost:1001'))