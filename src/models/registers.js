const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const staffSchema = new mongoose.Schema({
    name : {
        type:String,
        require:true
    },
    email : {
        type:String,
        require:true,
        unique:true
    },
    phone : {
        type:Number,
        require:true,
        unique:true
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
// generate token 
staffSchema.methods.generateAuthToken = async function(){
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
// converting password to hash
staffSchema.pre("save", async function(next){

    if(this.isModified("password")){
    // const passwordhash = await bcrypt.hast(password,10);
    // console.log(`the current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(`the hash password is ${this.password}`);
    this.cpassword = await bcrypt.hash(this.password, 10);

}
    next();
})

// create collection 

const Register = new mongoose.model("Register",staffSchema);
module.exports=Register;