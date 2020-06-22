'use strict'

const Crypto = use('crypto')
const Helpers = use('Helpers')


/**
 * Helper to generate random string.
 * Use in path name images, generate tokens
 * @param { int } length
 * @return { string } the random string
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
 * @returns { Object<FileJar> }
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

 /**
 * Helper to manage multiple uploads and send
 * the upload to path requested, if not specified,
 * sendo to '/public/uploads'
 * @param { FileJar } file
 * @param { string } path
 * @returns { Object }
 */

 const manage_multiple_uploads = async (fileJar, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')
  let successes = [], errors = []

  await Promise.all(fileJar.files.map(async file => {
    const random_name = await str_random(25)
    let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`
    await file.move(path, {
      name: filename
    })

    if(file.moved()) {
      successes.push(file)
    } else {
      errors.push(file.error())
    }
  }))

  return successes, errors
 }

module.exports = {
    str_random,
    manage_single_upload,
    manage_multiple_uploads
}
