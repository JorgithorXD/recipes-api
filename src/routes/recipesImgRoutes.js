import express from 'express'
import { upload } from '../controllers/uploadRecipe.js'
import { get } from '../controllers/getRecipes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import multer from 'multer'
import fs from 'fs'
import https from 'https'


const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination: join(__dirname, '../public/uploads/'),
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const uploads = multer({
    storage,
    dest: join(__dirname, '../public/uploads/')
})

router.post('/post/src/single-img', uploads.single('imageFiles'), async (req, res) => {
    try {
        var fileBuffer = fs.readFileSync(req.file.path)
        var base64Image = fileBuffer.toString('base64')

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
                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error('Error al eliminar el archivo:', err)
                        }
                    })
                    res.json(responseJson.data.link)
                } else {
                    res.status(imgurRes.statusCode).send('Error al subir la imagen a Imgur')
                }
            })
        })

        imgurReq.on('error', function (error) {
            console.error(error)
            res.status(500).send('Error interno del servidor')
        })

        imgurReq.write(data)
        imgurReq.end()
    } catch (error) {
        console.log(error)
    }
})

router.post('/post/src/multiple-img', uploads.array('imageFiles', 5), async (req, res) => {
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