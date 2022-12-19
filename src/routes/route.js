const { Router } = require('express')
const router = Router()

router.get('/test', function(req,res){
    res.send("Hello World")
})

router.all("/**", function(req, res){
    res.status(404).send({status:false, message:"your URL is wrong plese check endpoint"})
})

module.exports = router