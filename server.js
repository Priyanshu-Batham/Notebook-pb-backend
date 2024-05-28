const express = require("express");
const app = express();
const apis = require('./routes/apis')

//establishing connection to the Cloud Mongo DB
const connectToDb = require('./database')
connectToDb()

//middleware to let server access the request's body
app.use(express.json());

//specifing Api Routes
app.use('/apis', apis);


// Starting the server
app.listen(3000, ()=>{
    console.log("Server started")
})