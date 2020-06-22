'use strict'

const Crypto = use('crypto')
const Helpers = use('Helpers')


/**
 * Helper to generate random string.
 * Use in path name images, generate tokens
 * @param { int } length
 * @return { string } - the random string
*/

const str_random = async (length = 40) => {
    let string = ''
    let len = string.length

    if(len < length) {
        let size = length - len
        let bytes = await Crypto.randomBytes(size)
        let buffer = Buffer.from(bytes)
        string += buffer
            .toString('base64')
            .replace(/[^a-zA-Z]/g, '')
            .substr(0, size)
    }
    return string
}

module.exports = {
    str_random
}
