const express = require('express');
const app = express();

const PORT = 5000;



app.get('/', (req, res) => {
    res.send("You have reached Sibaflow API");
});

app.listen(PORT, () => {
    console.log("Server Running on PORT:" + PORT);
})