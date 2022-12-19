const { Router } = require('express')
const router = Router()
const userController = require("../controllers/userController")

router.get('/test', function(req,res){
    res.send("Hello World")
})

//router.all("/**", function(req, res){
   // res.status(404).send({status:false, message:"your URL is wrong plese check endpoint"})
//})
router.post("/register",userController.userCreate)
module.exports = router