const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();

const { objHasVals, hashEncrypt } = require('../utils/utils');
const UserModel = require("../models/UserModel");

//TODO add a check for duplicate usernames
router.post('/signup', async (req, res) => {
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
            res.status(400).json({message: 'One of the entries are missing'});
        }

        return ;
    }
    res.status(400).json({
        message: 'Bad Request'
    })
});

//To login
//TODO make this case insensitive
//TODO Add login via token possible
router.post('/signin', async (req, res) => {
    const reqUname = req.body.username;
    const reqPass = req.body.password;
    console.log("Outside");
    if(reqUname != undefined && reqPass != undefined){ //Submitted Username and Password are not empty
        let userData = await UserModel.find({ username: reqUname}); //Find user with submitted username

        if(userData.length > 0){
            userData = userData[0];
        }else{
            res.status(400).json({message: 'No user with this username exists'});
            return ;
        }

        if(userData?.password && await bcrypt.compare(reqPass, userData.password)){ //if user is found and password matches
            const accessToken = jwt.sign({_id: userData._id, username: userData.username}, process.env.JWT_SECRET, {expiresIn: '24h'}); //sign id and username to generate token
            console.log("Inside");
            res.status(200).json({data: {token: accessToken}, message: 'Login Successful'}); //submit back the token
            return ;
        }
    }
    res.status(400).json({message: 'One of the entries are missing'});
});

router.get('/', async (req, res) => {
    
    const users = await UserModel.find({}, { password: 0 });

    try{
        console.log(req.header("token"));
        res.json(users);
    }catch(err){
        console.log("Error@Get-User: " + err);
        res.json({message: 'The Server has faced some problem while processing your request' });
    }

});

module.exports = router;