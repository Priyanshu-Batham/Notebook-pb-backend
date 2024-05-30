const express = require("express");
const app = express();
const userRoute = require('./routes/user')
const noteRoute = require('./routes/note')

//establishing connection to the Cloud Mongo DB
const connectToDb = require('./database')
connectToDb()

//middleware to let server access the request's body
app.use(express.json());

//a default response for all requests
app.get("/", (req, res)=>{
    res.send("api is working use get: /getusers or post: /createuser");
});

//specifing Api Routes for Users
app.use('/user', userRoute);
//specifing Api Routes for Notes
app.use('/note', noteRoute);


// Starting the server
app.listen(3000, ()=>{
    console.log("Server started")
})