const userModel = require('../models/userModel')
const jwt=require("jsonwebtoken")


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

module.exports = {loginData,userById};