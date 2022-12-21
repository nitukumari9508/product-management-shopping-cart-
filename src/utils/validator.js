const mongoose = require("mongoose");

const isEmpty = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

const isValidBody = function (object) {
    return Object.keys(object).length > 0;
}

const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z ]+$/;
    return nameRegex.test(name);
}

const isValidPhone = function (num) {
    const reg = /^[0-9]{10}$/;
    return reg.test(num);
}

const isValidEmail = function (email) {
    const emailRegex =
        /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
    return emailRegex.test(email);
}



const isValidpincode = function (pincode) {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
};

const isValidInstallment = function isInteger(value) {
    if (value < 0) return false
    if (value % 1 == 0) return true;
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isvalidQuantity = function isInteger(value) {
    if (value < 1) return false
    if (isNaN(Number(value))) return false
    if (value % 1 == 0) return true
}
//const isValidprice = function (price) {
   // if (typeof price !== "Number" ) return false;
    //const priceRegex = /^(\d{1,2})(,\d{2})*(,\d{1,3}){1}(\.\d{1,})?$/g;
    //return priceRegex.test(price);
//}
const isvalidPrice = function (price) {
    return /^\d{0,8}(\.\d{1,2})?$/.test(String(price));
  };
  const isvalidSize = function (size) {
    return ["S", "XS", "M", "X", "L", "XXL", "XL"].includes(size);
  };
  
module.exports = { isvalidSize,isvalidPrice, isEmpty,isValidName, isValidEmail, isValidPhone, isValidBody, isValidpincode,isValidInstallment,isValidObjectId ,isvalidQuantity}


