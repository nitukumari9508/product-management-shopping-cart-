const orderModel = require("../models/orderModel")
const validator = require("../utils/validator")
const userModel = require("../models/userModel")
const cartModel = require("../models/cartMode")



const { isValidBody, isEmpty, isValidObjectId, isvalidQuantity } = validator


const createOrder = async function (req, res) {
    try {
        const userId = req.params.userId
        const data = req.body
        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Please provide valid request body" })

        let { cartId } = data

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please provide valid User Id" })
        let userdata = await userModel.findById(userId)
        if (!userdata) return res.status(404).send({ status: false, msg: "user not found" })

        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Please provide valid cart Id" })
        let cartdata = await cartModel.findById(cartId)
        if (!cartdata) return res.status(404).send({ status: false, msg: "cart not found" })

        let totalQuantity = 0
        const itemsArr = cartdata.items
        for (let i = 0; i < itemsArr.length; i++) {
            totalQuantity += itemsArr[i].quantity

        }

        const orderData = {
            userId: userId,
            items: cartdata.items,
            totalPrice: cartdata.totalPrice,
            totalItems: cartdata.totalItems,
            totalQuantity: totalQuantity

        }
        const saveData = await orderModel.create(orderData)
        await cartModel.findOneAndUpdate({ _id: cartId, userId: userId }, { items: [], totalItems: 0, totalPrice: 0 })
        return res.status(201).send({ status: true, message: "Success", data: saveData });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createOrder }