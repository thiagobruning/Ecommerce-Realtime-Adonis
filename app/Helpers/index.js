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

/**
 * Helper to manage a single upload and send
 * the upload to path requested, if not specified,
 * sendo to '/public/uploads'
 * @param { FileJar } file
 * @param { string } path
 */

 const manage_single_upload = async (file, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')
  const random_name = await str_random(25)
  // name of the file = current time + random string + extension
  let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`
  await file.move(path, {
    name: filename
  })

  return file
 }

module.exports = {
    str_random,
    manage_single_upload
}
