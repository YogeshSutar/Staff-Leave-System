const jwt = require('jsonwebtoken');
const Admin_Register = require("../models/admindata");

const authadmin = async (req, res, next)=>{
try {
    
    const token = req.cookies.jwt;
    const verifyAdmin = jwt.verify(token, process.env.SECRATE_KEY);
    // console.log(verifyAdmin);
    const user = await Admin_Register.findOne({_id:verifyAdmin._id})
    // console.log(user);

    req.token = token;
    req.user = user;
    next();
    // console.log(verifyAdmin);
} catch (error) {
    res.status(401).send(error);
}
}
module.exports = authadmin;
