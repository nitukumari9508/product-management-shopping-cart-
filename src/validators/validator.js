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




module.exports = { isEmpty, isValidName, isValidEmail, isValidPhone, isValidBody, isValidpincode, }


