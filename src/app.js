require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const hbs = require('hbs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const authadmin = require('./middleware/authadmin');
const nodemailer = require('nodemailer');
const alert = require('alert'); 
// express.use(session({secret:config.sessionSecret}))
// const bodyparser = require('body-parser');
// const mongoose = require('mongoose');
// import 'index' from './index.hbs';
require("./db/conn")

// const index = require("index")


const Register = require("./models/registers")
const Admin_Register = require("./models/admindata")
const Staffleave = require("./models/staffleave")
const Staffleavedub = require("./models/staffleavedub")
// mongoose.set('strictQuery', false);
// // mongoose.set('strictQuery', true);
// mongoose.connect("mongodb://localhost:27017/StaffleaveMS", {useNewUrlParser: true, useUnifiedTopology: true })
// .then( ()=>console.log("connection successfull"))
// .catch((err)=>console.log(err));

const port = process.env.port || 8000;
// console.log(__dirname);


const staticPath = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")
// console.log(staticpath)
// app.use(express.static(staticpath))

// app.use('/js',express.static(path.resolve(__dirname,"assets/js")))



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// buildtin middleware
app.use(express.static(staticPath))
app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)


app.get('/', (req, res) => {
    // function math1(req,res){
    //     res.write("hey");
    //     res.end();
    // }
    res.render("index")
    // res.end();
// http.createServer().listen(index);
})




// http.createServer(math1).listen(2000);

// app.get('/leave', auth,(req, res) => {
//     // console.log(`cookies is : ${req.cookies.jwt}`);
//     // console.log("asdasdasdasdasd");


//             // console.log(verifyUser);
//             res.render("leave")
            
//         })

app.get('/leave', auth,async(req, res) => {
            // console.log("asdasdasdasdasd");
            
            // const useremail = await Register.findOne({ email: email })
            // const token = await useremail.generateAuthToken()
            // // console.log("the token part " + token);
            
            
            // res.cookie("jwt", token, {
                //     expires: new Date(Date.now() + 5000000),
                //     httpOnly: true,
                // });
                
                // console.log(`cookies is : ${req.cookies.jwt}`);
                const token = req.cookies.jwt;
                const verifyUser = jwt.verify(token, process.env.SECRATE_KEY);
                // console.log(verifyUser);
                const user = await Register.findOne({_id:verifyUser._id})
                // .exec((err, leavedata)=>{
                //     console.log(user); 
                // if(leavedata){
                    // res.render("AdminCheckStatus",{data:leavedata});
                    res.render("leave",{userdata:user})
                // }
                    // console.log(verifyUser);
                    
                })








var database
app.get('/AdminCheckStatus', authadmin , async(req, res) => {
    // console.log(`cookies is : ${req.cookies.jwt}`);
    // console.log("asdasdasdasdasd");
// database.collection('staffleavedetails').find({}).toArray((err,result)=>{
//     if(err) throw err
//     res.send(result)
// })
let leaveresult = await Staffleave.find({}).exec((err, leavedata)=>{
    if(leavedata){
        res.render("AdminCheckStatus",{data:leavedata});
    }
})
// Staffleave.find({})
// .then((x)=>{
//     res.render("AdminCheckStatus",{x})
//     console.log(x)
// })
// .catch((y)=>{
// console.log(y)
// })

})

// staff leave page Details Fetch From Database

// Staffleave.find({}, function(err,resleave){
//     if(err) console.warn(err);
//     console.warn(resleave);
// })


app.get('/logout', auth,(req, res) => {
try {


    // console.log(` ${req.user}`);

    req.user.tokens = req.user.tokens.filter((current_element)=>{
        return current_element.token != req.token
    })

    
    res.clearCookie("jwt");
    
    console.log("current element " + req.user.tokens);

    console.log("logout seccessfully")

    req.user.save();

    res.render("index");
    // document.getElementById('logout').style.display="none";

    // document.getElementById('logout').style.display="none";
} catch (error) {
    res.status(500).send(error);
}
})




app.get('/logoutadmin', authadmin,(req, res) => {
    try {
    
    
        console.log(` REQUEST USER =============================   ${req.user} `);
    
        req.user.tokens = req.user.tokens.filter((current_element)=>{
            return current_element.token != req.token
        })
    
        res.clearCookie("jwt");
    
    
        console.log("logout seccessfully")
    
        req.user.save();
    
        res.render("index");
        // document.getElementById('logout').style.display="none";
    
        // document.getElementById('logout').style.display="none";
    } catch (error) {
        res.status(500).send(error);
    }
    })
    







app.get('/signup', (req, res) => {
    res.render("signup")
})
app.get('/login', (req, res) => {
    res.render("login")
})
app.get('/admin', (req, res) => {
    res.render("admin")
})

app.get('/staff_status', async(req, res) => {

    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECRATE_KEY);
    // console.log(verifyUser);
    const user = await Staffleavedub.findOne({_id:verifyUser._id})
    console.log(user);
    res.render("staff_status" , { userleave:user })
})

const userindex = async(req , res)=>{

    // req.user.tokens = req.user.tokens.filter((current_element)=>{
    //     return current_element.token != req.token
    // })
    res.redirect("/");
}

app.get('/index',userindex);

const backleave = async(req , res)=>{

    // req.user.tokens = req.user.tokens.filter((current_element)=>{
    //     return current_element.token != req.token
    window.history.back()
}
app.get('/back',backleave);
// delete user ================================



const deleteUser = async(req , res)=>{
    try {
        const id = req.query.id;
        const admin_delete = await Staffleave.deleteOne({ _id:id });
        console.log("delete admin "+admin_delete);

        
        if(!admin_delete){
            res.status(400).send("Does not cancel");
        }
        else{
            res.redirect("AdminCheckStatus");
            // {success:'Delete Data Successfully'},
        }
        // res.send("AdminCheckStatus",{title:"Approve leave"})
    } catch (error) {
    }
}

app.get('/delete_leave', deleteUser);


// delete user end

//approve staff start================================



const approveUser = async (req, res) => {
  try {
    const id = req.query.id;

    // Create a new Staffleavedub object
    const StaffLeaveDub = new Staffleavedub({
      id: req.query.id,
      name: req.query.name,
      email: req.query.email,
      Dept_name: req.query.Dept_name,
      numberofdays: req.query.numberofdays,
      description: req.query.description,
      leaveDateFrom: req.query.leaveDateFrom,
      leaveDateTo: req.query.leaveDateTo,
    });

    // Save the new Staffleavedub object
    const leaveStaff = await StaffLeaveDub.save();

    // Delete the corresponding Staffleave object
    const admin_delete = await Staffleave.deleteOne({ _id: id });
    console.log('delete admin ' + admin_delete);
    console.log('Dublicate data ' + leaveStaff);

    // Send an email to the staff member
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yogiall12345@gmail.com',
        pass: 'YOGI@ALL#12345#',
      },
    });

    const mailOptions = {
      from: 'yogiall12345@gmail.com',
      to: email,
      subject: 'Leave Request Approved',
      text: 'Your leave request has been approved.',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.redirect('AdminCheckStatus');
  } catch (error) {
    res.status(400).send('Could not approve leave request');
  }
};

app.get('/approve_leave', approveUser);

// const approveUser = async(req , res)=>{
//     try {
        
//         const id = req.query.id;
//         const StaffLeaveDub = new Staffleavedub({
//          id: req.query.id,
//          name: req.query.name,
//          email: req.query.email,
//          Dept_name: req.query.Dept_name,
//          numberofdays: req.query.numberofdays,
//          description: req.query.description,
//          leaveDateFrom: req.query.leaveDateFrom,
//          leaveDateTo: req.query.leaveDateTo
//         })
//         const leaveStaff = await StaffLeaveDub.save();
//         const admin_delete = await Staffleave.deleteOne({ _id:id });
//         console.log("delete admin "+admin_delete);
//         console.log("Dublicate data "+leaveStaff);

//         // alert("approve leave")
//         // if(leaveStaff == admin_delete){
//         //     res.render("staff_leave")
//         // }
//         // ,{title:"leave approve"}
//         // if(leaveStaff){
//             // res.status(201).;
//             // var messagesend = message("approve leave");
//                 // req.flash('message', 'You are now logged out.');
//             res.redirect("AdminCheckStatus" );
//             // res.render("AdminCheckStatus",{aprovesuccess:'Aprove Data Successfully'} );
//             // {aprovesuccess:'Aprove Data Successfully'} + 
//             // res.status()
//         // }
//         // else{
//         // }
        
//     } catch (error) {
//         res.status(400).send("Does not cancel");
//     }
// }

// app.get('/approve_leave', approveUser);

// app.get('/staff_status', async(req, res) => {
    // try {
        
        
        
        // let leaveresult = await Staffleavedub.findById({_id:req.cookies._id})
        // // .exec((err, leavedatas)=>{
        //     console.log(leaveresult);
        //     // if(leavedatas){
        //         // console.log(leavedatas)
        //         res.render("staff_status",{data:leavedatas,title:''});

        // let leaveresult = await Staffleavedub.findById({_id:req.cookies._id})

        //         res.render("staff_status",{data:leaveresult});
            
        // }
            // } catch (error) {
            //     res.status(400).send(error);
            // }
                // }
// })
// })


// app.post('/generate_token', async (req, res) => {
//     try {

//         const token = await adminuser_detail.generateAuthToken()
//         console.log("the token part " + token);

//         res.cookie("jwt", token, {
//             expires: new Date(Date.now() + 5000000),
//             httpOnly: true,
//         });
//     }
// catch{
//     res.status(400).send("Token Not Generated");
// }});
    
app.post('/admin', async (req, res) => {
    try {
        const admin_username = req.body.admin_username;
        // console.log(admin_username);
        const password = req.body.password;

            // console.log(`${admin_username} and password is ${password}`);
        const adminuser_detail = await Admin_Register.findOne({ admin_username: admin_username })

        // console.log("admin Registers " + adminuser_detail);

        // res.send(adminuser_detail.password); 
        // console.log("admin name " + adminuser_detail);

        const token = await adminuser_detail.generateAuthToken()
        // console.log("the token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 5000000),
            httpOnly: true,
        });

        if(adminuser_detail.password === password){
            res.status(201).render("index",{hidepage:token});
            // const hidepage = ()=>{
            //     document.getElementById("userlogout").style.display="none";
            // }
        }
        else{ 
            res.send("Invaild Detail Password")
        }

        // const isMatch = await bcrypt.compare(password, admin_user_detail.password);

        // const token = await adminuser_detail.generateAuthToken()
        // console.log("the token part " + token);

        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + 5000000),
        //     httpOnly: true,
        // });


        //    const registerd = await registerStaff.save();
        // if (isMatch) {
        //     res.status(201).render("leave");
        // }       
        // else
        // {
        //     res.send("Invaild Login Details");    }
    
     }
      catch (error) {
        res.status(400).send("Invalid All Login Details");
    }
})

// app.post('/admin', async (req, res) => {
// try {
//             const token = await adminuser_detail.generateAuthToken()
//         console.log("the token part " + token);

//                 res.cookie("jwt", token, {
//             expires: new Date(Date.now() + 5000000),
//             httpOnly: true,
//         });
// } catch (error) {
//     res.status(400).send("Invalid All Login Details");
    
// }
// })


// create a new user in our database
app.post('/registers', async (req, res) => {
    try {
        // console.log(req.body.name);
        // res.send(req.body.name)

        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password === cpassword) {

            const registerStaff = new Register({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                cpassword: cpassword
            })
            // console.log("the success part " + registerStaff);

            const token = await registerStaff.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 1000),
                httpOnly: true
            });
            // console.log("cookies here" + cookie)

            const registerd = await registerStaff.save();

            res.status(201).render("login");

        }
        else {
            res.send("Password not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})


//login validation
 app.post('/login', async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        
        const useremail = await Register.findOne({ email: email })
        const isMatch = await bcrypt.compare(password, useremail.password);
        
        const token = await useremail.generateAuthToken()
        // console.log("the token part " + token);
        

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 5000000),
            httpOnly: true,
        });
        
        
        //    const registerd = await registerStaff.save();
        if (isMatch) {
            res.status(201).render("index",{hideuserlogout:token});

        }
        else {
            res.send("Invaild password Details");
        }

        // if(token !== undefined){
        //     document.getElementById("logout").style.display="none";
        // }
        // else{
        //     document.getElementById("logout").style.display="block";
        // }
    } catch (error) {
        res.status(400).send("Invalid all Login Details");
    }
})

// if(loginpage == undefined){
//             document.getElementById("logout").style.display="none";

// }


app.post('/staffleave' ,async  (req, res) => {

    try {
        const StaffLeaveDetail = new Staffleave({
            name: req.body.name,
            email: req.body.email,
            Dept_name: req.body.Dept_name,
            leavetype: req.body.leavetype,
            numberofdays: req.body.numberofdays,
            description: req.body.description,
            leaveDateFrom: req.body.leaveDateFrom,
            leaveDateTo: req.body.leaveDateTo
        })
        // res.render()
        // console.log(verifyAdmin);
        // const user = await Register.findOne({_id:verifyAdmin._id})
        // console.log("the success part " + StaffLeaveDetail);
        // const email = req.body.email;
        // const password = req.body.password;
        
        // const useremail = await Register.findOne({ email: email })
        // // user token
        // const token1 = await useremail.generateAuthToken()
        // res.cookie("jwt", token1, {
            //     expires: new Date(Date.now() + 5000000),
            //     httpOnly: true,
            // });

            // const token = req.cookies.jwt;
            // const verifyUser = jwt.verify(token, process.env.SECRATE_KEY);
            // console.log(verifyUser);
            // const emaildetail = await Register.find({}).exec((err, leavedata)=>{
            //     if(leavedata){
            //         res.send("leave", {emaildata:leavedata });
            //     }
            // })
            // console.log(user);
        
            // req.token = token;
            // req.user = user;
            // next();
            // console.log(emaildetail);


            // let emailresult = await Register.findOne({_id:verifyUser._id})
                // }
            // })
        // // admin token
        
        // const token = await adminuser_detail.generateAuthToken()
        // // console.log("the token part " + token);

        // res.cookie("jwt", token, {
        //     expires: new Date(Date.now() + 5000000),
        //     httpOnly: true,
        // });

        const leaveStaff = await StaffLeaveDetail.save();
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRATE_KEY);
        // console.log(verifyUser);
        const user = await Register.findOne({_id:verifyUser._id})
        // .exec((err, leavedata)=>{
        //     console.log(user); 
        // if(leavedata){
            // res.render("AdminCheckStatus",{data:leavedata});
            // res.render("leave",{userdata:user})
        // const leaveStaffSecond = await StaffLeaveDetailSecond.save();
        // then((x)=>{
        // const alertmsg = alert("Leave Send Successfull...");
        // alert("message")
            res.status(201).render("leave",{success:'leave send successfully',userdata:user});
        // })
        
    } catch (error) {
        res.status(400).send(error);
    }
})



app.get('*', (req, res) => {
    res.render('404', {
        errorcomment: "page not found"
    });
});
app.listen(port, () => {
    console.log("LISTEN PORT IS START");
});



// data directory : C:\Program Files\MongoDB\Server\4.2\data\
//log directory : C:\Program Files\MongoDB\Server\4.2\log\