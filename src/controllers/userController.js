const userModel = require('../models/userModel')
const jwt=require("jsonwebtoken")
const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')

const userCreate = async function(req,res){
    try{
        
        let files = req.files;

let data = req.body
const {fname,lname,email,profileImage,phone,password,address,billing}= data
if(!fname)return res.status(400).send({status:false, message:"fname is requires"})
if(!lname)return res.status(400).send({status:false, message:"lname is requires"})
if(!email)return res.status(400).send({status:false, message:"email is requires"})
if(!profileImage)return res.status(400).send({status:false, message:"profileImage is requires"})
if(!phone)return res.status(400).send({status:false, message:"phone is requires"})
if(!password)return res.status(400).send({status:false, message:"password is requires"})
if(!address)return res.status(400).send({status:false, message:"address is requires"})
if(!billing)return res.status(400).send({status:false, message:"billing is requires"})


const isEmailAleadyUsed = await userModel.findOne({ email})
if (isEmailAleadyUsed) {return res.status(400).send({status: false, message: `${email} is already in use, Please try a new email.`})}

const isPhoneAleadyUsed = await userModel.findOne({ phone })
if (isPhoneAleadyUsed) {return res.status(400).send({status: false, message: `${phone} is already in use, Please try a new phone number.`})}


profileImage = await config.uploadFile(files[0]); //uploading image to AWS
const encryptedPassword = await bcrypt.hash(password, 10) //encrypting password by using bcrypt.

//object destructuring for response body.
userData = {fname,lname,email,profileImage,phone,password: encryptedPassword,address,biiling}
const saveUserData = await userModel.create(userData);
return res.status(201).send({status: true, message: "user created successfully.", data: saveUserData });

    }catch(error){
        return res.status(500).send({status:false, message:error.message})
    }
}

// ---------------login----
const loginData = async function (req, res) {
    try {
      let userdata = req.body
      
      let {email,password}=userdata
      if (!emailValidator.validate(email)) return res.status(400).send({ status: false, msg: "Please Enter Valid email ID" })


      let userInfo = await userModel.findOne({ email: email, password: password });
      if (!userInfo){
        return res.status(400).send({ Status: false, massage: "Plase Enter Valid UserName And Password" })}
  
      let userToken = jwt.sign({
        userId: userInfo._id.toString(),
        iat: Date.now()
      },
        'Book-Project',{expiresIn:"18000s"}
      )

      return res.status(200).send({status: true, message: " User login successfull",  data: userId, userToken })
    }
    catch (err) {
     return res.status(500).send({ status: false, errer: err })
    }
  }
//-------------------get user---------------------------------

const userById = async function(req,res){

    try {
        
        const userId = req.params.userId
    
        let data = await userModel.findById(userId)
    
        if (!data){return res.status(404).send({status:false, message:"User not found"})}
        if (data.isDeleted===true){return res.status(404).send({status:false, message:"User data is deleted"})}
    
        const userDetails = await userModel.find({userId: userId},{isDeleted:false}).select({isDeleted:0})
        
        return res.status(200).send({status:true,message:"User profile details", data :userDetails})
        
    } catch (error) {
        return res.status(500).send({status:false,msg: error.message})
        
    } 
    } 

module.exports = { loginData , userById , userCreate }
