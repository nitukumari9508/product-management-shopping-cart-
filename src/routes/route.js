const { Router } = require('express')
const router = Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")

router.get('/test', function (req, res) {
    res.send("Hello World")
})

router.post("/register", userController.userCreate)

router.post("/login", userController.userLogin)

router.get("/user/:userId/profile", userController.userById)

router.put("/user/:userId/profile", userController.updateUser)

router.all("/**", function(req, res){
res.status(404).send({status:false, message:"your URL is wrong plese check endpoint"})
})
module.exports = router