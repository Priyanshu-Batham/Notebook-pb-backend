const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next){
    //fetching token from request's header
    const token = req.header('authToken');
    //returning error if no token is found
    if(!token) return res.send({error: "no token in header"});

    //if token found, in header then we decode it
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SIGN);
        req.id = decodedData.id;
      } catch(err) {
        return res.send({"error": "Invalid Token"});
      }

    next();
}

module.exports = auth;