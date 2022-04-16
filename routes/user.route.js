const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const express = require("express");
const router = express.Router();

const {
  objHasVals,
  hashEncrypt,
  verifyToken,
  createObjVals,
} = require("../utils/utils");
const UserModel = require("../models/UserModel");

//TODO Get minimal user information, provided its ID

/**
 * Handles User Signup
 */
router.post("/signup", async (req, res) => {
  if (req.body != undefined) {
    const valsToCheck = ["name", "username", "cms", "email", "password"];
    const dataObj = req.body;

    if (objHasVals(valsToCheck, dataObj)) {
      try {
        //Check if the same username already exists
        const user = await UserModel.findOne({
          username: dataObj.username.toLowerCase(),
        });

        //If user with this username doesn't exist then register
        if (user == null) {
          dataObj.password = await hashEncrypt(req.body.password);
          const newUser = new UserModel(dataObj);
          await newUser.save();
          res.status(200).json(newUser);
        } else {
          res.status(400).json({ message: "This username is already in use" });
        }
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

/**
 * Handles User Signin Via Username and Password
 */
router.post("/signin", async (req, res) => {
  try {
    const reqUname = req.body.username?.toLowerCase(); //Convert to lowercase to search in the database
    const reqPass = req.body.password;

    //if Submitted Username and Password are not empty
    if (reqUname != undefined && reqPass != undefined) {
      //Find user with submitted username
      let userData = await UserModel.findOne({ username: reqUname });

      //If user exist
      if (userData == null) {
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
    //TODO Send back a message to user telling them that they are trying to use an email, username or cms_id that is already in use
    console.log("Error@User-POST-Signin: " + err.message);
    res.status(500).json({
      message: "Server has faced some issue while processing your request",
    });
  }
});

/**
 * Handels User Signin Via Token
 */
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
      res.status(200).json({
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

/**
 * Handles Submitting Back All Users Data
 */
router.get("/", async (req, res) => {
  const users = await UserModel.find({}, { password: 0 });

  try {
    res.json(users);
  } catch (err) {
    console.log("Error@Get-User: " + err);
    res.json({
      message:
        "The Server has faced some problem while processing your request",
    });
  }
});

/**
 * Handles Updating Data for an existing user
 */
router.patch("/update", async (req, res) => {
  try {
    //First Validate Token
    const token = req.header("token");

    if (token != undefined) {
      let tokenData = verifyToken(token);

      //If token is invalid, send back an error message
      if (tokenData === undefined) {
        res.status(401).json({ message: "Invalid Token" });
        return;
      }

      //TODO check that there are no properties in the obj other then defined below
      const valsToCheck = ["name", "username", "cms", "email", "password"];
      let dataObj = req.body;
      const valsToUpdate = createObjVals(valsToCheck, dataObj);

      //If there are fields to update
      if (valsToUpdate != null) {
        const updatedUser = await UserModel.findByIdAndUpdate(
          tokenData._id,
          { ...valsToUpdate }, //If Faced with problems spread dataObj here rather than valsToUpdate
          { returnDocument: "after", fields: { password: 0 } }
        );
        res
          .status(200)
          .json({ message: "Update Successful", data: updatedUser });
        return;
      }
      res.status(400).json({ message: "Nothing to update" });
      return;
    }
    res.status(401).json({ message: "Unauthorized Access, Invalid Token" });
    return;
  } catch (err) {
    res
      .status(500)
      .json({
        message: "We are facing an issue while processing your request",
      });
    return;
  }
});

module.exports = router;
