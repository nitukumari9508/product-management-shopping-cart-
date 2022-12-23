const cartModel = require("../models/cartMode")
const validator = require("../utils/validator")


const { isValidBody, isEmpty, isValidObjectId, isvalidQuantity } = validator


const cartData = async function (req, res) {
    try {
        const userId = req.params.userId
        const data = req.body

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Please provide valid request body" })

        let { productId, cartId, quantity } = data


        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please provide valid User Id" })
        let userdata = await UserModel.findById(userId)
        if (!userdata) return res.status(404).send({ status: false, msg: "user not found" })


        if (!productId) return res.status(400).send({ status: false, msg: "Product id is mandatory " })
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, msg: "Please Enter productId" })
        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) return res.status(400).send({ status: false, msg: "Product doesn't exists!" })


        if (!quantity) {
            quantity = 1
        } else {
            if (!isvalidQuantity(quantity)) return res.status(400).send({ status: false, message: "Please provide valid quantity & it must be greater than zero." })
        }


        if (cartId) {
            if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, msg: "Please Enter valide cartId" })
            const existingcart = await cartModel.findOne({ _id: cartId, userId: userId })
            if (!existingcart) return res.status(400).send({ status: false, msg: "cart is not presrnt Or not belongs to user" })


            //updating price when products get added or removed.
            let price = existingcart.totalPrice + (data.quantity * product.price)
            let itemsArr = existingcart.items
            for (i in itemsArr) {
                if (itemsArr[i].productId.toString() === productId) {
                    itemsArr[i].quantity += quantity
                    itemsArr[i].productId = productId

                    let updatedCart = { items: itemsArr, totalPrice: price, totalItems: itemsArr.length }
                    let responseData = await cartModel.findOneAndUpdate({ _id: cartId }, updatedCart, { new: true })

                    return res.status(200).send({ status: true, message: `Product added successfully`, data: responseData })

                }
            }
        }

        if (!cartId) {

            if (!existingcart) {
                const cartData = {
                    userId: userId,
                    items: [{ productId: productId, quantity: quantity, }],
                    totalPrice: product.price * quantity,
                    totalItems: 1
                }

                const createCart = await cartModel.create(cartData)
                return res.status(201).send({ status: true, message: `Cart created successfully`, data: createCart })
            }
        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}








const getCart = async function (req, res) {
    try {
        let userId = req.params.userId

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "Invalid userId" });

        let findUser = await userModel.findById(userId)
        if (!findUser) return res.status(404).send({ status: false, message: "User not found" })

        let findCart = await cartModel.findOne({ userId: userId })
        if (!findCart) return res.status(404).send({ status: false, message: "cart is not found" })

        return res.status(200).send({ status: true, message: "Success", data: findCart })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}
//-----------
const deleteCart = async function (req, res) {
    try {
        let userId = req.params.userId


        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: "Invalid userId" });


        let findUser = await userModel.findById(userId)
        if (!findUser) return res.status(404).send({ status: false, message: "User not found" })


        let items = [];
        let totalPrice = 0
        let totalItems = 0
        const deleatedCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: items, totalPrice: totalPrice, totalItems: totalItems }, { new: true });
        return res.status(200).send({ status: true, message: 'csrt deleated Successfully', data: deleatedCart });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { cartData, deleteCart, getCart }