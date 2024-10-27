const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const staffAdminSchema = new mongoose.Schema({
    admin_username : {
        type:String,
        require:true
    },
    password : {
        type:String,
        require:true
    },    
    cpassword : {
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
})


staffAdminSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRATE_KEY);
        this.tokens = this.tokens.concat({token:token})
        // console.log(token);
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part"+error);
        console.log("the error part"+error);
    }
}
// create collection 

const Admin_Register = new mongoose.model("Admindata",staffAdminSchema);
module.exports= Admin_Register;