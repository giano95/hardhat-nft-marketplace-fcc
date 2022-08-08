const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")

// Initialize the pinata obj
const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

// Upload all the images in the specified path to pinata
async function uploadImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let imagesResponses = []

    try {
        for (file of files) {
            const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${file}`)
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            imagesResponses.push(response)
        }
    } catch (error) {
        console.log(error)
    }
    return { imagesResponses }
}

async function uploadMetadata(metadata, name) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata, {
            pinataMetadata: {
                name: name,
            },
        })
        return response
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = { uploadImages, uploadMetadata }
