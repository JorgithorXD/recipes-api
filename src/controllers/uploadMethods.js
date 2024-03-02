import fs from 'fs'
import https from 'https'

async function uploadSingleImage(file) {
    return new Promise((resolve, reject) => {
        try {
            if (!file || !file.buffer || file.buffer.length === 0) {
                reject('No se proporcionó ningún archivo o archivo inválido.')
                return
            }

            var base64Image = file.buffer.toString('base64')

            var data = JSON.stringify({
                'image': base64Image,
                'type': 'base64'
            })

            var options = {
                hostname: 'api.imgur.com',
                path: '/3/image',
                method: 'POST',
                headers: {
                    'Authorization': 'Client-ID dd17b3a0b3a3f03',
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            }

            var imgurReq = https.request(options, function (imgurRes) {
                var responseData = ''

                imgurRes.on('data', function (chunk) {
                    responseData += chunk
                })

                imgurRes.on('end', function () {
                    var responseJson = JSON.parse(responseData)
                    if (imgurRes.statusCode === 200) {
                        resolve(responseJson.data.link)
                    } else {
                        reject('Error al subir la imagen a Imgur')
                    }
                })
            })

            imgurReq.on('error', function (error) {
                console.error(error)
                reject('Error interno del servidor')
            })

            imgurReq.write(data)
            imgurReq.end()
        } catch (error) {
            reject(error)
        }
    })
}

async function uploadMultipleImages(files) {
    const promises = files.map(file => uploadSingleImage(file))
    return Promise.all(promises)
}

export {
    uploadSingleImage,
    uploadMultipleImages
}