const cartModel = require("../models/cartMode")
const validator = require("../utils/validator")
const cartData = async function (req, res) {
    try {
        const userId = req.params.userId

        let { productId, cartId, quantity } = req.body
        console.log(req.body)
        if (!validator.isValidBody(req.body))
            return res.status(400).send({ status: false, message: "Please provide valid request body" })

        if (!validator.isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "Please provide valid User Id" })


        if (!validator.isValidObjectId(productId) || !validator.isEmpty(productId))
            return res.status(400).send({ status: false, message: "Please provide valid Product Id" })

        
if(!quantity){
    quantity=1
}else(!validator.isEmpty(quantity) || !validator.validQuantity(quantity))
   return res.status(400).send({ status: false, message: "Please provide valid quantity & it must be greater than zero." })
    
        const finduserData = await cartModel.findById({ userId: userId })
        if (!finduserData) return res.status(404).send({ status: false, message: " user not found" })
        //if (finduserData._id.toString() != userIdFromToken)
           // return res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });

        const findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!findProduct) return res.status(400).send({ status: false, message: `Product doesn't exist by ${productId}` })

        const findCartOfUser = await cartModel.findOne({ userId: userId }) //finding cart related to user.

        if (!findCartOfUser) {
            var cartData = {
                userId: userId, items: [{ productId: productId, quantity: quantity, }],
                totalPrice: findProduct.price * quantity, totalItems: 1
            }

            const createCart = await cartModel.create(cartData)
            return res.status(201).send({ status: true, message: `Cart created successfully`, data: createCart })
        }
        if (findCartOfUser) {

            //updating price when products get added or removed.
            let price = findCartOfUser.totalPrice + (req.body.quantity * findProduct.price)
            let itemsArr = findCartOfUser.items
            for (i in itemsArr) {
                if (itemsArr[i].productId.toString() === productId) {
                    itemsArr[i].quantity += quantity

                    itemsArr.push({ productId: productId, quantity: quantity })
                    let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }
                    let responseData = await cartModel.findOneAndUpdate({ _id: findCartOfUser._id }, updatedCart, { new: true })

                    return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })

                }
            }
        }
    } catch (error) { return res.status(500).send({ status: false, message: error.message }) }
}


module.exports = { cartData }