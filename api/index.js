const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const User=require('./models/User.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
require('dotenv').config();
const app = express();

//WT15n2wKSIH569eB

const bcryptSalt=bcrypt.genSaltSync(10);//10-rounds of encryp

const jwtsecret='somerandomcode';

app.use(express.json());//for req.body

app.use(cookieParser())

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
app.post('/login',async (req,res)=>{
    const {email,password}=req.body;
    const userDoc=await User.findOne({email:email})
    if(userDoc){
        const passOk=bcrypt.compareSync(password,userDoc.password);
        console.log(passOk);
        if(passOk){
           jwt.sign({email:userDoc.email,id:userDoc._id},jwtsecret,{},
            (err,token)=>{
                if(err)throw err;
                res.cookie('token',token).json(userDoc) 
           }) 
           
        }else{
            res.status(422).json("Pass Not Ok")
        }
    }else{
        res.json("Not found")
    }
})

app.get('/profile',(req,res)=>{
    const {token}=req.cookies;
    if(token){
        jwt.verify(token,jwtsecret,{},async (err,user)=>{
            if(err)throw err;
            const {name,email,_id}=await User.findById(user.id);
            res.json({name,email,_id});
        })
    }else{
        res.json(null);
    }
    
    
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true);
})

app.listen(3000,function(req,res){
    console.log("Running at port 3000")
})