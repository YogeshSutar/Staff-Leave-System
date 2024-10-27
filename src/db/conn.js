const mongoose = require('mongoose');
// mongoose.set('strictQuery', false);
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/STAFF_LEAVE_MS",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true,
    // useIndexModify:true
}).then(()=>{
console.log("connected")
})
.catch((err)=>{
    console.log(err);
})