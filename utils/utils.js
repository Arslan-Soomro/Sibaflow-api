require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
 * Takes in an array of keys, searches in obj for those keys and returns an array of keys that
 * are present in both obj and keysArr. If there are no such keys then null is returned
 * @param {Array<String>} keysArr 
 * @param {Object} obj
 * @returns  Array<String> | null
 */
const extractObjVals = (keysArr, obj) => {
    const extractedKeys = [];
    if(keysArr != undefined && obj != undefined){
        for(let index in keysArr){
            if(obj[keysArr[index]] != undefined){
                extractedKeys.push(keysArr[index]);
            }
        }
    }
    
    if(extractedKeys.length > 0){
        return extractedKeys;
    }
    
    return null;
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

const verifyToken = (token) => {
    try{
        //console.log("@token: " + token);
        const data = jwt.verify(token, process.env.JWT_SECRET);
        return data;
    }catch(err){
        console.log("Error@TokenAuthentication: " + err);  
    }
    return undefined;
}

module.exports = { objHasVals, extractObjVals, hashEncrypt, verifyToken }