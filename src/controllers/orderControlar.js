const orderModel = require("../models/orderModel")
const validator = require("../utils/validator")
const userModel = require("../models/userModel")
const productModel = require("../models/productModel")
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













    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}