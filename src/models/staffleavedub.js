const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const staffleaveSchemadub = new mongoose.Schema({
    id : {
        type:String,
        require:true
    },    
    name : {
        type:String,
        require:true
    },
    email : {
        type:String,
        require:true,
    },
    Dept_name : {
        type:String,
        require:true,
    },
    numberofdays : {
        type:Number,
        require:true
    },
    description : {
        type:String,
        require:true
    },
    leaveDateFrom : {
        type:String,
        require:true
    },
    leaveDateTo : {
        type:String,
        require:true
    }
})

// generate token 
// staffSchema.methods.generateAuthToken = async function(){
//     try {
//         console.log(this._id);
//         const token = jwt.sign({_id:this._id.toString()},process.env.SECRATE_KEY);
//         this.tokens = this.tokens.concat({token:token})
//         // console.log(token);
//         await this.save();
//         return token;
//     } catch (error) {
//         res.send("the error part"+error);
//         console.log("the error part"+error);
//     }
// }
// converting password to hash
// staffSchema.pre("save", async function(next){

//     if(this.isModified("password")){
//     // const passwordhash = await bcrypt.hast(password,10);
//     // console.log(`the current password is ${this.password}`);
//     this.password = await bcrypt.hash(this.password, 10);
//     // console.log(`the hash password is ${this.password}`);
//     this.cpassword = await bcrypt.hash(this.password, 10);

// }
//     next();
// })

// create collection 



const Staffleavedub = new mongoose.model("StaffLeaveDetailDub",staffleaveSchemadub);

// const StaffleaveSecond = new mongoose.model("StaffLeaveDetailSecond",staffleaveSchema);
module.exports=Staffleavedub;
// module.exports=StaffleaveSecond;