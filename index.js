const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/registrationFormDB");

const registerSchema = new mongoose.Schema(
    {
        name : String,
        email : String,
        password : String
    }
);

// model for registerSchema

const Registration = mongoose.model("Registration",registerSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/pages/index.html');
})

app.post("/register", async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        const existUser = new Registration.findOne({email:email});
        if(!existUser){
            const registrationData = new Registration({
                name,
                email,
                password
            })
    
            await registrationData.save();
            res.sendFile(__dirname + '/pages/success.html');

        }
        else{
            console.log("Already user exist");
            res.redirect('/error');
        }

       

    }
    catch(error){
        console.log(error);
        res.sendFile(__dirname+'/pages/error.html');
    }
    
});

app.get("/success",(req,res)=>{
    res.sendFile(__dirname + '/pages/success.html');
});

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+'/pages/error.html');
})

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
    

})

