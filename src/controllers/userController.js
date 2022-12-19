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

module.exports = {userCreate}