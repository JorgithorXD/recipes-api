import express from 'express'
import { upload } from '../controllers/uploadRecipe.js'
import { get } from '../controllers/getRecipes.js'

const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const recipe = await get._AllRecipes()
        res.json(recipe).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/form/post', (req, res) => {
    res.send('<form action="/recipe/post" method="post"><button type="submit">Enviar</button></form>')
})

router.post('/post', async (req, res) => {
    try {
       
        upload.basicRecipe('recipes_basic', TartaDeManzana)

    } catch (error) {
        console.log('Error al subir la receta' + error)
    }
})
export default router