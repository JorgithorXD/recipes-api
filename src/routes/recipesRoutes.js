import express from 'express'
import { upload } from '../controllers/uploadRecipe.js'
import { get } from '../controllers/getRecipes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

router.post('/post', async (req, res) => {
    try {

        upload.basicRecipe('recipes_basic', TartaDeManzana)

    } catch (error) {
        console.log('Error al subir la receta' + error)
    }
})

export default router