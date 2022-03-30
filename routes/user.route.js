const express = require('express');
const router = express.Router();

const { objHasVals, hashEncrypt } = require('../utils/utils');
const UserModel = require("../models/UserModel");

//TODO don't return back user password

router.post('/', async (req, res) => {
    if(req.body != undefined) {
        
        const valsToCheck = ['name', 'username', 'cms', 'email', 'password']
        const dataObj = req.body;

        if(objHasVals(valsToCheck, dataObj)){
            try{
                dataObj.password = await hashEncrypt(req.body.password);
                const newUser = new UserModel(dataObj);
                await newUser.save();
                res.status(200).json(newUser);
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

router.get('/', async (req, res) => {
    
    const users = await UserModel.find({});

    try{
        res.json(users);
    }catch(err){
        console.log("Error@Get-User: " + err);
        res.json({message: 'The Server has faced some problem while processing your request' });
    }

});

module.exports = router;