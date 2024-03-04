import https from 'https'

async function uploadSingleImage(stream) {
    return new Promise((resolve, reject) => {
        try {
            if (!stream || typeof stream.pipe !== 'function') {
                reject('No se proporcionó ningún flujo de datos o flujo de datos inválido.')
                return
            }

            let base64Data = ''
            stream.setEncoding('base64')

            stream.on('data', chunk => {
                base64Data += chunk
            })

            stream.on('end', () => {
                const data = JSON.stringify({
                    image: base64Data,
                    type: 'base64'
                })

                const options = {
                    hostname: 'api.imgur.com',
                    path: '/3/image',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Client-ID dd17b3a0b3a3f03',
                        'Content-Type': 'application/json',
                        'Content-Length': data.length
                    }
                }

                const imgurReq = https.request(options, imgurRes => {
                    let responseData = ''

                    imgurRes.on('data', chunk => {
                        responseData += chunk
                    })

                    imgurRes.on('end', () => {
                        if (imgurRes.statusCode === 200) {
                            let imageUrl
                            if (imgurRes.headers['content-type'].startsWith('image/')) {
                                // Si el tipo de contenido es una imagen, asumimos que la respuesta es la URL de la imagen
                                imageUrl = responseData // Esto depende de cómo Imgur esté enviando la URL de la imagen
                            } else if (imgurRes.headers['content-type'] === 'application/json') {
                                // Si el tipo de contenido es JSON, analizamos la respuesta como JSON
                                const responseJson = JSON.parse(responseData)
                                imageUrl = responseJson.data.link
                            } else {
                                // Manejar otros tipos de respuesta según sea necesario
                            }

                            resolve(imageUrl)
                        } else {
                            reject('Error al subir la imagen a Imgur')
                        }
                    })
                })

                imgurReq.on('error', error => {
                    console.error(error)
                    reject('Error interno del servidor')
                })

                imgurReq.on('error', error => {
                    console.error(error)
                    reject('Error interno del servidor')
                })

                imgurReq.write(data)
                imgurReq.end()
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function uploadMultipleImages(streams) {
    try {
        const uploadPromises = streams.map(stream => uploadSingleImage(stream))
        const uploadedLinks = await Promise.all(uploadPromises)
        return uploadedLinks
    } catch (error) {
        throw error
    }
}

export {
    uploadSingleImage,
    uploadMultipleImages
}