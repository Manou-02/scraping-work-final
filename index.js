const express = require('express');
require('dotenv').config();
const locationBienici = require('./src/routes/bienici/location.routes');


const PORT = process.env.PORT;
const app = express();  

app.use('/bienici', locationBienici);;


app.listen(PORT, () => {
    console.log(`Server started in port : ${PORT}`);
})