const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            required: true,
            ref: "User",
            unique: true,
            trim: true,
        },
        items: [
            {
                _id: false,
                productId: {
                    type: ObjectId,
                    required: true,
                    ref: "product",
                    trim: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    trim: true,
                    default:1
                },
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            trim: true,
        },
        totalItems: {
            type: Number,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);