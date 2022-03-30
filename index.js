require('dotenv').config()
const express = require('express');
const mongoose = require("mongoose");
const connection = require("./utils/connection");
const { objHasVals } = require('./utils/utils');
const UserModel = require("./models/UserModel");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
//Connect To MongoDB
mongoose.connect(connection.str, connection.options);
const db = mongoose.connection;



app.get('/', (req, res) => {
    res.send("You have reached Sibaflow API");
});

app.post('/user', async (req, res) => {
    if(req.body != undefined) {
        
        const valsToCheck = ['name', 'username', 'cms', 'email', 'password']
        const dataObj = req.body;

        if(objHasVals(valsToCheck, dataObj)){
            try{
                const newUser = new UserModel(dataObj);
                await newUser.save();
                res.json(newUser);
            }catch(err){
                console.log("Error@Post-User: " + err);
                res.status(500).json({message: 'The Server has faced some problem while processing your request'});
            }
        }else{
            res.json({message: 'One of the entries are missing'});
        }

        return ;
    }
    res.status(400).json({
        message: 'Bad Request'
    })
});

app.get('/user', async (req, res) => {
    
    const users = await UserModel.find({});

    try{
        res.json(users);
    }catch(err){
        console.log("Error@Get-User: " + err);
        res.json({message: 'The Server has faced some problem while processing your request' });
    }
});

app.listen(PORT, () => {
    console.log("Server Running on PORT:" + PORT);
    
    //Connection Status
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
        console.log("Mongodb Connected successfully");
    });
})