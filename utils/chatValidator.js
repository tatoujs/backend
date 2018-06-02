"use strict";

module.exports.isValid = (chatToValidate) => {
    return (chatToValidate._id && chatToValidate.exchangeIds
        && chatToValidate.user1 && chatToValidate.user2
        && chatToValidate.date);
};