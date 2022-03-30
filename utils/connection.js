const mongoose = require("mongoose");
const db_username = process.env.MDB_UNAME;
const db_password = process.env.MDB_PASS;
const db_name = process.env.MDB_NAME;


const connection = {
  str: `mongodb+srv://${db_username}:${db_password}@cluster0.dn8rs.mongodb.net/${db_name}?retryWrites=true&w=majority`,
  options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

module.exports = connection;


