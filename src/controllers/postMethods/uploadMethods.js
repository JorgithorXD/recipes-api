import https from 'https'
import ImageKit from 'imagekit'

var imagekit = new ImageKit({
    privateKey: "private_AOgu21GUBXcCpjYFgbnmJi8DwR8=",
    publicKey: "public_n9XP7e+6IRMZYTJIgJXFtXVtwKM=",
    urlEndpoint: "https://ik.imagekit.io/uv3u01crv"
})

async function uploadSingleImage(img, buffer) {
    try {
        return new Promise((resolve, reject) => {
            imagekit.upload(
                {
                    file: img.buffer ? img.buffer: buffer,
                    fileName: img.originalname
                }
            ).then(response => {
                console.log(response.url)
                resolve(response.url)
            }).catch(error => {
                console.log(error)
                reject(error)
            })

        })
    } catch (error) {
        console.log('Error general al subir la imagen: ' + error)
    }
}

async function uploadImageWithoutBuffer(img) {
    try {
        if (!img.buffer) {
            const buffer = Buffer.from(img.base64, 'base64')

            const imageLink = await uploadSingleImage(img, buffer)

            return imageLink
        }
    } catch (error) {

    }
}

async function uploadMultipleImages(files) {
    try {
        const uploadedLinks = []

        for (const file of files) {
            const uploadedLink = await uploadSingleImage(file)
            uploadedLinks.push(uploadedLink)
        }

        return uploadedLinks
    } catch (error) {
        throw error
    }
}

export {
    uploadSingleImage,
    uploadMultipleImages,
    uploadImageWithoutBuffer
}