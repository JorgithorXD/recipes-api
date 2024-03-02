import express from 'express'
import { upload } from '../controllers/uploadRecipe.js'
import { get } from '../controllers/getRecipes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import multer from 'multer'
import { uploadSingleImage, uploadMultipleImages } from '../controllers/uploadMethods.js'
import { isLogged } from '../controllers/middelwares.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

router.post('/all-data', uploads.array('recipeImage'), async (req, res) => {
    try {
        console.log(req.body)

        const uploadImages = await uploadMultipleImages(req.files)
        res.json(uploadImages)
    } catch (error) {
        console.log(error)
    }
})

router.get('/all', async (req, res) => {
    try {
        const recipe = await get._AllRecipes()
        res.json(recipe).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/form/img', (req, res) => {
    res.sendFile(join(__dirname, '../public/recipeImgForm.html'))
})

router.get('/form', isLogged, (req, res) => {
    res.sendFile(join(__dirname, '../public/recipeForm.html'))
})

router.post('/post', async (req, res) => {
    try {

        upload.basicRecipe('recipes_basic', TartaDeManzana)

    } catch (error) {
        console.log('Error al subir la receta' + error)
    }
})

export default router