const { Router } = require('express')
const router = Router()
const userController = require("../controllers/userController")
const productController = require("../controllers/productController")

router.get('/test', function(req,res){
    res.send("Hello World")
})

//router.all("/**", function(req, res){
   // res.status(404).send({status:false, message:"your URL is wrong plese check endpoint"})
//})
router.post("/register",userController.userCreate)
router.post("/login",userController.userLogin)
router.get("/user/:userId/profile",userController.userById)
router.put("/user/:userId/profile",userController.userById)
//------------product---------------//
router.post("/product",productController.createProduct)
router.get("/products",productController.getAllProducts)
router.get("/products/:productId",productController.getProductsById)
router.put("/products/:productId",productController.updateProduct)
router.delete("/products/:productId",productController.deleteById)
module.exports = router