const mongoose = require('mongoose')
require('dotenv').config();

async function connectToDatabase(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection Success");
    }
    catch(e){
        console.log(e);
    }
}

module.exports = connectToDatabase