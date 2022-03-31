const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const express = require("express");
const router = express.Router();

const { objHasVals, hashEncrypt, verifyToken } = require("../utils/utils");
const UserModel = require("../models/UserModel");

//TODO add a check for duplicate usernames
router.post("/signup", async (req, res) => {
  if (req.body != undefined) {
    const valsToCheck = ["name", "username", "cms", "email", "password"];
    const dataObj = req.body;

    if (objHasVals(valsToCheck, dataObj)) {
      try {
        dataObj.password = await hashEncrypt(req.body.password);
        const newUser = new UserModel(dataObj);
        await newUser.save();
        res.status(200).json(newUser);
      } catch (err) {
        console.log("Error@Post-User: " + err);
        res.status(500).json({
          message:
            "The Server has faced some problem while processing your request",
        });
      }
    } else {
      res.status(400).json({ message: "One of the entries are missing" });
    }

    return;
  }
  res.status(400).json({
    message: "Bad Request",
  });
});

//To login via username and password
router.post("/signin", async (req, res) => {
  try {
    if (reqUname != undefined && reqPass != undefined) {
      const reqUname = req.body.username?.toLowerCase(); //Convert to lowercase to search in the database
      const reqPass = req.body.password;

      //if Submitted Username and Password are not empty

      //Find user with submitted username
      let userData = await UserModel.find({ username: reqUname });

      //If user exist
      if (userData.length > 0) {
        userData = userData[0];
      } else {
        //else send an error response
        res.status(400).json({ message: "Invalid Username" });
        return;
      }

      //Check if password is correct
      if (
        userData?.password &&
        (await bcrypt.compare(reqPass, userData.password))
      ) {
        //if user is found and password matches
        //sign id and username to generate token
        const accessToken = jwt.sign(
          { _id: userData._id, username: userData.username },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        res
          .status(200)
          .json({ data: { token: accessToken }, message: "Login Successful" }); //submit back the token
        return;
      } else {
        res.status(400).json({ message: "Invalid Password" });
        return;
      }
    }
    res.status(400).json({ message: "One of the fields are missing" });
  } catch (err) {
    console.log("Error@User-POST-Signin: " + err.message);
    res
      .json(500)
      .status({
        message: "Server has faced some issue while processing your request",
      });
  }
});

//To login via token
router.get("/signin", async (req, res) => {
  try {
    const token = req.header("token");

    //If We have received a token
    if (token != undefined) {
      //Verify token and extract its data
      let tokenData = verifyToken(token);

      //If token is invalid, send back an error message
      if (tokenData === undefined) {
        res.status(401).json({ message: "Invalid Token" });
        return;
      }

      //If token is valid, Return back all user data except password
      let userData = await UserModel.findOne(
        { username: tokenData.username.toLowerCase() },
        { password: 0 }
      );
      res
        .status(200)
        .json({
          message: "Token Authenticated, Access Granted",
          data: userData,
        });

      return;
    }
    res.status(401).json({ message: "Token Not Found" });
  } catch (err) {
    console.log("Error@User-GET-Signin: " + err.message);
    res.status(500).json({
      message: "Server has faced an issue while processing your request",
    });
  }
});

router.get("/", async (req, res) => {
  const users = await UserModel.find({}, { password: 0 });

  try {
    console.log(req.header("token"));
    res.json(users);
  } catch (err) {
    console.log("Error@Get-User: " + err);
    res.json({
      message:
        "The Server has faced some problem while processing your request",
    });
  }
});

module.exports = router;
