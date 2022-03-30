
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

module.exports = { objHasVals }