const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

function authToken(req, res, next){
 req.userId = undefined
 const cookies = req.headers.cookie?.split('; ')
 let token;
 
 if(cookies != undefined) {
  cookies.forEach(cookie => {
    if(cookie.trim().startsWith('token=')) token = cookie.split('=')[1]
  });
  try {
   const decoded = jwt.verify(token, process.env.JWT_TOKEN);
   req.userId = decoded._id
  } catch(err) {
   console.log("got error getting the token")
  }
 }
 next()
}

module.exports.authToken = authToken;
