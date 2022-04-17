require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connection = require("./utils/connection");
const userRouter = require("./routes/user.route");
const postRouter = require("./routes/post.route");
const commentRouter = require("./routes/comment.route");
const { verifyToken } = require("./utils/utils");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
//Connect To MongoDB
mongoose.connect(connection.str, connection.options);
const db = mongoose.connection;

//With every request that carries a token, the token is verified here
app.use((req, res, next) => {
  //Extract token from header
  const token = req.header("token");

  if (token != undefined) {
    //If token exists
    let tokenData = verifyToken(token); //Verify Token
    if (tokenData != undefined) {
      //Verified Token
      req.body.IT_DATA = tokenData; //
    }
  }

  next();
});

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);

app.get("/", (req, res) => {
  res.send("You have reached Sibaflow API");
});

app.listen(PORT, () => {
  console.log("Server Running on PORT:" + PORT);

  //Connection Status
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Mongodb Connected successfully");
  });
});
