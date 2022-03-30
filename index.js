require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const connection = require("./utils/connection");
const userRouter = require("./routes/user.route");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/user', userRouter);
//Connect To MongoDB
mongoose.connect(connection.str, connection.options);
const db = mongoose.connection;


app.get('/', (req, res) => {
    res.send("You have reached Sibaflow API");
});

app.listen(PORT, () => {
    console.log("Server Running on PORT:" + PORT);
    
    //Connection Status
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
        console.log("Mongodb Connected successfully");
    });
})