const express = require("express");
const app = express();
const path = require('path');
const userRoute = require('./routes/user')
const noteRoute = require('./routes/note')
const cors = require('cors')

//establishing connection to the Cloud Mongo DB
const connectToDb = require('./database')
connectToDb()

//middleware to let server access the request's body
app.use(express.json());

//middleware to enable cors
app.use(cors());

//testing the redirection of backend routes to frontend routes
app.use('/sharenote/:noteId', express.static(path.join(__dirname, 'static', 'index.html')));

// Serve static files from the "static" directory
app.use(express.static(path.join(__dirname, 'static')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

//specifing Api Routes for Users
app.use('/user', userRoute);
//specifing Api Routes for Notes
app.use('/note', noteRoute);

// Starting the server
app.listen(3000, ()=>{
    console.log("Server started")
})