const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const User=require('./models/User.js');
const bcrypt=require('bcryptjs');
require('dotenv').config();
const app = express();

//WT15n2wKSIH569eB

const bcryptSalt=bcrypt.genSaltSync(10);//10-rounds of encryp
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:'http://127.0.0.1:5173'
}));


// console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL);
app.get('/test',function(req,res){
    res.json('test okk')
});
app.get('/',function(req,res){
    res.json('test okk')
});

app.post('/register',async (req,res)=>
{   
    console.log("I am alive")
    const {name,email,password}=req.body;
    try{
        const UserDoc=await User.create({
        name,
        email,
        password:bcrypt.hashSync(password,bcryptSalt),
        });

        res.json(UserDoc);
        
    }catch(e){
        res.status(422).json(e);
    }
    
});

app.listen(3000,function(req,res){
    console.log("Running at port 3000")
})