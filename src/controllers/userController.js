const userModel = require('../models/userModel')
const jwt=require("jsonwebtoken")
const config = require("../utils/awsConfig")
const bcrypt = require('bcrypt')
const validator = require("../utils/validator")
const userCreate = async function(req,res){
    try{
        
let files = req.files;
let data = req.body
const {fname,lname,email,phone,password,address}= data
if(!fname)return res.status(400).send({status:false, message:"fname is requires"})
if(!lname)return res.status(400).send({status:false, message:"lname is requires"})
if(!email)return res.status(400).send({status:false, message:"email is requires"})
//if(!profileImage)return res.status(400).send({status:false, message:"profileImage is required"})
if(!phone)return res.status(400).send({status:false, message:"phone is required"})
if(!password)return res.status(400).send({status:false, message:"password is required"})
if(!address)return res.status(400).send({status:false, message:"address is required"})
const isEmailAlreadyUsed = await userModel.findOne({ email})
if (isEmailAlreadyUsed) {return res.status(409).send({status: false, message: `${email} is already in use, Please try a new email.`})}

const isPhoneAlreadyUsed = await userModel.findOne({ phone })
if (isPhoneAlreadyUsed) {return res.status(409).send({status: false, message: `${phone} is already in use, Please try a new phone number.`})}
console.log(address)
if (address.shipping) {
    if (address.shipping.street) {
        if (!validator.isValidBody(address.shipping.street)) 
            return res.status(400).send({status: false, message: "Shipping address's Street Required"})
        
    } else 
        return res.status(400).send({ status: false, message: " Invalid request parameters. Shipping address's street cannot be empty" })
    

    if (address.shipping.city) {
        if (!validator.isValidBody(address.shipping.city)) 
            return res.status(400).send({status: false, message: "Shipping address city Required"})
        
    } else return res.status(400).send({ status: false, message: "Invalid request parameters. Shipping address's city cannot be empty" })
    
    if (address.shipping.pincode) {
        if (!validator.isValidBody(address.shipping.pincode)) 
            return res.status(400).send({status: false, message: "Shipping address's pincode Required"})
        
    } else return res.status(400).send({ status: false, message: "Invalid request parameters. Shipping address's pincode cannot be empty" })
    
} else  return res.status(400).send({ status: false, message: "Shipping address cannot be empty." })

// Billing Address validation

if (address.billing) {
    if (address.billing.street) {
        if (!validator.isValidBody(address.billing.street)) 
            return res.status(400).send({status: false, message: "Billing address's Street Required"})
        
    } else return res.status(400).send({ status: false, message: " Invalid request parameters. Billing address's street cannot be empty" })
    
    if (address.billing.city) {
        if (!validator.isValidBody(address.billing.city))  
        return res.status(400).send({status: false, message: "Billing address's city Required"})
        
    } else 
        return res.status(400).send({ status: false, message: "Invalid request parameters. Billing address's city cannot be empty" })
    
    if (address.billing.pincode) {
        if (!validator.isValidBody(address.billing.pincode)) 
            return res.status(400).send({status: false, message: "Billing address's pincode Required "})
        
    } else 
        return res.status(400).send({ status: false, message: "Invalid request parameters. Billing address's pincode cannot be empty" })
    
} else 
    return res.status(400).send({ status: false, message: "Billing address cannot be empty." })

profileImage = await config.uploadFile(files[0]); //upload image to AWS
const encryptedPassword = await bcrypt.hash(password, 10) //encrypting password by using bcrypt.

//object destructuring for response body.
userData = {fname,lname,email,profileImage,phone,password: encryptedPassword,address}
const saveUserData = await userModel.create(userData);
return res.status(201).send({status: true, message: "user created successfully.", data: saveUserData });

    }catch(error){return res.status(500).send({status:false, message:error.message})}
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
    const updateUser = async function (req, res) {
        try {
            let userId = req.params.userId;
            const data = req.body;
    
            if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" });
    
            let { fname, lname, email, phone, password, profileImage, address } = data;
    
            const dataToUpdate = {}
            if (fname) {
                if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "First name is invalide" })
                dataToUpdate.fname = fname
            }
    
            if (lname) {
                if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "Last Name is invalide" });
                dataToUpdate.lname = lname
            }
    
            if (email) {
                if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Provide a valid email id" });
                const findEmail = await userModel.findOne({ email: email });
                if (findEmail) return res.status(400).send({ status: false, message: "email id already exist" });
                dataToUpdate.email = email
            }
    
            if (phone) {
                if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "Invalid phone number" });
                const checkPhone = await userModel.findOne({ phone: phone });
                if (checkPhone) return res.status(400).send({ status: false, message: "phone number already exist" });
                dataToUpdate.phone = phone
            }
    
            if (password) {
                if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Password should be Valid min 8 character and max 15 " })
                dataToUpdate.password = password
            }
    
            if (profileImage) {
                dataToUpdate.eImagprofile = eImagprofile
            }
    
            if (address) {
                if (!isValidBody(address)) return res.status(400).send({ status: false, message: "Insert Data in address" });
    
                if (!isEmpty(data.address.shipping)) {
                    return res.status(400).send({ status: false, message: "Please enter shipping address!" });
                }
                if (!isEmpty(data.address.shipping.city) || !isValidName(data.address.shipping.city)) {
                    return res.status(400).send({ status: false, message: "Please provide a valid city in shiping address!" });
                }
                if (!isEmpty(data.address.shipping.street) || !isValidStreet(data.address.shipping.street)) {
                    return res.status(400).send({ status: false, message: "Please provide a valid street in shiping address!" });
                }
                if (!isEmpty(data.address.shipping.pincode) || !isValidpincode(data.address.shipping.pincode)) {
                    return res.status(400).send({ status: false, message: "Please provide a valid pincode in shiping address!" });
                }
                if (!isEmpty(data.address.billing)) {
                    return res.status(400).send({ status: false, message: "Please enter billing address!" });
                }
                if (!isEmpty(data.address.billing.city) || !isValidName(data.address.billing.city)) {
                    return res.status(400).send({ status: false, message: "Please provide a valid city in billing address!" });
                }
                if (!isEmpty(data.address.billing.street) || !isValidStreet(data.address.billing.street)) {
                    return res.status(400).send({ status: false, message: "Please provide a valid street in billing address!" });
                }
                if (!isEmpty(data.address.billing.pincode) || !isValidpincode(data.address.billing.pincode)) {
                    return res.status(400).send({ status: false, message: "Please provide a valid pincode in billing address!" });
                }
                dataToUpdate.address = address
            }
    
            let updateData = await userModel.findOneAndUpdate({ _id: userId }, { dataToUpdate }, { new: true });
            res.status(200).send({ status: true, message: "User profile updated", data: updateData });
        } catch (err) {
            res.status(500).send({ status: false, message: err.message });
        }
    }

module.exports = { loginData , userById , userCreate,updateUser }
