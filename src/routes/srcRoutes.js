import express from 'express'
import { upload } from '../controllers/uploadRecipe.js'
import { getRecipes } from '../controllers/getRecipes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import multer from 'multer'
import fs from 'fs'
import https from 'https'
import { uploadMultipleImages, uploadSingleImage } from '../controllers/uploadMethods.js'


const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.memoryStorage();
const uploads = multer({
    storage: storage,
    preservePath: true
})

router.get('/test', (req, res) => {
    res.sendFile(join(__dirname, '../public/uploadImage.html'))
})

router.post('/post/single-img', uploads.array('recipeImage'), async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).send('No se ha proporcionado ningún archivo');
        }

        console.log(req.files)
        const images = await uploadMultipleImages(req.files)

        res.json({ images })

    } catch (error) {
        console.log(error)
    }
})

router.post('/post/multiple-img', uploads.array('recipeImages', 10), async (req, res) => {
    try {
        const files = req.files

        const uploadPromises = files.map(async (file) => {
            const fileBuffer = fs.readFileSync(file.path)
            const base64Image = fileBuffer.toString('base64')

            const data = JSON.stringify({
                'image': base64Image,
                'type': 'base64'
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

            return new Promise((resolve, reject) => {
                const imgurReq = https.request(options, function (imgurRes) {
                    let responseData = ''

                    imgurRes.on('data', function (chunk) {
                        responseData += chunk
                    })

                    imgurRes.on('end', function () {
                        if (imgurRes.statusCode === 200) {
                            fs.unlink(file.path, (err) => {
                                if (err) {
                                    console.error('Error al eliminar el archivo:', err)
                                }
                            })
                            const responseJson = JSON.parse(responseData)
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
            })
        })

        Promise.all(uploadPromises)
            .then((links) => {
                res.json({ links })
            })
            .catch((error) => {
                console.error(error)
                res.status(500).send('Error al procesar las imágenes')
            })
    } catch (error) {
        console.log(error)
        res.status(500).send('Error interno del servidor')
    }
})

export default router