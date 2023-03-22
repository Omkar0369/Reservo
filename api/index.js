const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const User=require('./models/User.js');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
require('dotenv').config();
const imageDownloader = require('image-downloader');
const multer=require('multer')
const fs=require('fs')
const app = express();

//WT15n2wKSIH569eB

const bcryptSalt=bcrypt.genSaltSync(10);//10-rounds of encryp

const jwtsecret='somerandomcode';

app.use(express.json());//for req.body

app.use('/uploads',express.static(__dirname+"/uploads")   );

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

app.post('/upload-by-link',async (req,res)=>{
    const {link}=req.body;
    const newName="photo"+Date.now()+".jpg";
    await imageDownloader.image({
    url: link,
    dest: __dirname+'/uploads/'+newName,               // will be saved to /path/to/dest/image.jpg
    }).then(({ filename }) => {
            console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
        })
        .catch((err) => console.error(err));
        res.json(newName);
})

const photoMiddleware=multer({dest:'uploads'})
app.post('/upload',photoMiddleware.array("photos",100),(req,res)=>{
    const uploadedFiles=[];
    for(let i=0;i<req.files.length;i++){
        const {path,originalname}=req.files[i];
        const parts=originalname.split('.');
        const ext=parts[parts.length-1];
        const newPath=path+"."+ext;
        fs.renameSync(path,newPath);
        
        uploadedFiles.push(newPath.replace(/uploads/g,""));
        // console.log(uploadedFiles)
    }
    res.json(uploadedFiles);
})


app.listen(3000,function(req,res){
    console.log("Running at port 3000")
})