const bcrypt = require('bcrypt');


/**
 * Returns true if all given properties are defined in the given obejct, otherwise false.
 * @param {Array} valsArr - Array of values to check in the object
 * @param {Object} obj - Object to check for values in
 * @returns Boolean
 */
const objHasVals = (valsArr, obj) => {
    if(valsArr != undefined && obj != undefined){
        for(let index in valsArr) {
            if(obj[valsArr[index]] === undefined){
                return false;
            }
        }
        return true;
    }
    return false
}

/**
 * takes a normal string and returns encrypted version of the string
 * @param {String} strToEncrypt - String to encrypt
 * @returns String
 */

const hashEncrypt = async (strToEncrypt) => {
    const saltRounds = 10;
    const encryptedStr = await bcrypt.hash(strToEncrypt, saltRounds);
    return encryptedStr;
};

module.exports = { objHasVals, hashEncrypt }