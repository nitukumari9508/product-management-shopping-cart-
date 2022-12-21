const productModel = require("../models/productModel")
const validator = require("../utils/validator")
const currencySymbol = require("currency-symbol-map")
const config = require("../utils/awsConfig")

const { isValidName, isValidBody, isvalidPrice, isEmpty, isvalidSize, isValidObjectId } = validator

const createProduct = async function (req, res) {
    try {
        const data = req.body
        let files = req.files;

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Insert Data : BAD REQUEST" });

        const { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = data

        if (!title) return res.status(400).send({ status: false, message: "title is required" })
        if (!isValidName(title))
            return res.status(404).send({ status: false, message: "title should be in string format" });


        if (!description) return res.status(400).send({ status: false, message: "description is required" })
        if (!isValidName(description))
            return res.status(404).send({ status: false, message: "description should be in string format" });

             if (!isvalidPrice(price))
            return res.status(404).send({ status: false, message: "Please enter valid value for price" });
        if (!currencyId) return res.status(400).send({ status: false, message: "currencyId is required" })
        if (typeof currencyId !== "string" && currencyId !== 'INR')
            return res.status(404).send({ status: false, message: "Please enter price in INR" });


        if (!currencyFormat) return res.status(400).send({ status: false, message: "currencyFormat is required" })
        if (typeof currencyFormat !== "string" && currencyFormat !== "₹")
            return res.status(404).send({ status: false, message: "Please enter price in INR" });

        if (!isEmpty(style)) return res.status(404).send({ status: false, message: "Please enter valid style" });

        if (installments) {
            if (! typeof data.installments == Number) {
                return res.status(400).send({ status: false, message: "Installments should in correct format" })
            }
        }

            if (availableSizes) {
            let sizeArr = availableSizes.toUpperCase().split(",")
            for (let i = 0; i < sizeArr.length; i++) {
                if (!isvalidSize(size[i])) return res.status(400).send({ status: false, message: "Size is not available" })
            }
            data.availableSizes = sizeArr;
        }
        const findtitle = await productModel.findOne({ title, isDeleted: false })
        if (findtitle) return res.status(409).send({ status: false, message: "Please enter unique title" })
        const productImage = await config.uploadFile(files[0]);

        
        const productData = { title, description, price, currencyId, currencyFormat, style, availableSizes, installments, productImage: productImage }
        const productData1 = await productModel.create(productData)
        return res.status(201).send({ status: true, message: "Success", data: productData1 });
    } catch (error) { return res.status(500).send({ status: false, message: error.message }) }
}

const getAllProducts = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false } //complete object details.
        const queryParams = req.query;

        if (isEmpty(queryParams)) {
            const { size, name, priceGreaterThan, priceLessThan, priceSort } = queryParams;

            //validation starts.
            if (isEmpty(size))
                filterQuery['availableSizes'] = size


            //using $regex to match the subString of the names of products & "i" for case insensitive.
            if (isEmpty(name)) {
                filterQuery['title'] = {}
                filterQuery['title']['$regex'] = name
                filterQuery['title']['$options'] = 'i'
            }

            //setting price for ranging the product's price to fetch them.
            if (isEmpty(priceGreaterThan)) {

                if (!(!isNaN(Number(priceGreaterThan))) && (priceGreaterThan <= 0))
                    return res.status(400).send({ status: false, message: `priceGreaterThan should be a valid number` })


                if (!filterQuery.hasOwnproperty('price')) {
                    filterQuery['price'] = {}
                    filterQuery['price']['$gte'] = Number(priceGreaterThan)
                }
                //console.log(typeof Number(priceGreaterThan))
            }

            //setting price for ranging the product's price to fetch them.
            if (isEmpty(priceLessThan)) {

                if (!(!isNaN(Number(priceLessThan))) && (priceLessThan <= 0))
                    return res.status(400).send({ status: false, message: `priceLessThan should be a valid number` })


                if (!filterQuery.hasOwnProperty('price'))
                    filterQuery['price'] = {}
                filterQuery['price']['$lte'] = Number(priceLessThan)

            }

            //sorting the products acc. to prices => 1 for ascending & -1 for descending.
            if (isEmpty(priceSort)) {

                if (!((priceSort == 1) || (priceSort == -1))) return res.status(400).send({ status: false, message: `priceSort should be 1 or -1 ` })
                const products = await productModel.find(filterQuery).sort({ price: priceSort })

                if (Array.isArray(products) && products.length === 0)
                    return res.status(404).send({ productStatus: false, message: 'No Product found' })
                else return res.status(200).send({ status: true, message: 'Product list', data2: products })
            }
        }

        const products = await productModel.find(filterQuery)

        //verifying is it an array and having some data in that array.
        if (Array.isArray(products) && products.length === 0) {
            return res.status(404).send({ productStatus: false, message: 'No Product found' })
        }

        return res.status(200).send({ status: true, message: 'Product list', data: products })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}

//!..............................................................................
//fetch products by Id.
const getProductsById = async function (req, res) {
    try {
        const productId = req.params.productId

        //validation starts.
        if (!isValidObjectId(productId))
            return res.status(400).send({ status: false, message: `${productId} is not a valid product id` })

        //validation ends.

        const product = await productModel.findOne({ _id: productId, isDeleted: false });

        if (!product) return res.status(404).send({ status: false, message: `product does not exists` })


        return res.status(200).send({ status: true, message: 'Product found successfully', data: product })
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }
}
//---------update----------------------------------//

const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId
        let data = req.body
        let files = req.files


        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "ProductId is not valid" })

        const findProduct = await productModel.findById({ _id: productId })
        if (!findProduct) return res.status(404).send({ status: false, message: " Product not found" })

        if (findProduct.isDeleted == true) return res.status(404).send({ status: false, message: "Product is deleted allredy" })


        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: "false", message: "Please enter fields to update" });
        }

        const { title, description, price, style, availableSizes, installments } = data


        if (title) {
            if (!isEmpty(title)) return res.status(400).send({ status: false, message: "Title is not valid" })
            if (!isValidName(title.trim())) return res.status(404).send({ status: false, message: "title should be in string format" });
            const findTitle = await productModel.findOne({ title: title })
            if (findTitle) return res.status(400).send({ status: false, message: "This title is already exist" })

        }

        if (description) {
            if (!isEmpty(description)) return res.status(404).send({ status: false, message: "description should be in string format" });
        }

        if (price) {
            if (!isValidPrice(price)) {
                return res.status(400).send({ status: false, message: "Price is not present in correct format" })
            }
        }

        if (files) {
            if (files.length > 0) {
                let productImg = await uploadFile(files[0]);
                data.productImage = productImg;
            }
        }


        if (style) {
            if (!isEmpty(style)) return res.status(400).send({ status: false, message: "Style is not valid" })
        }

        if (availableSizes) {

            let sizeArr = availableSizes.toUpperCase().split(",")
            for (let i = 0; i < sizeArr.length; i++) {
                if (!isvalidSize(size[i])) return res.status(400).send({ status: false, message: "Size is not available" })
            }
            data.availableSizes = sizeArr;
        }


        if (installments) {
            if (! typeof data.installments == Number) {
                return res.status(400).send({ status: false, message: "Installments should in correct format" })
            }
        }

        const updatedProduct = await productModel.findByIdAndUpdate({ _id: productId }, data, { new: true })
        return res.status(200).send({ status: true, message: "Product Updated Successfully", data: updatedProduct })

    } catch (error) {
        return res.status(500).send({ status: "false", message: error.message })
    }
}
//----------------------delete-----------------///
const deleteById = async function (req, res) {
    try {
        const productId = req.params.Id

        const productData = await productModel.findById(productId)

        if (!productData) { return res.status(404).send({ msg: "No details exists with this productId" }) }
        if (productData.isDeleted === true) { return res.status(404).send({ msg: "product is already deleted" }) }
        let deleteProduct = await productModel.findOneAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        res.status(200).send({ status: true, msg: "product is sucessfully deleted", productId: deleteProduct })
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }

}

module.exports = { getProductsById, getAllProducts, createProduct, deleteById, updateProduct }