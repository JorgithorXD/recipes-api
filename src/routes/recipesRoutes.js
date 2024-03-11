import express from 'express'
import { upload } from '../controllers/uploadRecipe.js'
import { getRecipes } from '../controllers/getRecipes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import multer from 'multer'
import { uploadSingleImage, uploadMultipleImages } from '../controllers/uploadMethods.js'
import { isLogged } from '../controllers/middelwares.js'
import fs from 'fs/promises'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.memoryStorage();
const uploads = multer({
    storage: storage,
    preservePath: true
})

router.post('/all-data', uploads.array('recipeImage'), async (req, res) => {
    try {
        var { recipeName, recipeType, recipeTag, recipeTime, recipeTimeUnit, recipeIngredient, recipeIngredientUnit, recipeIngredientUnitCount, recipeSteps } = req.body

        recipeIngredient = Array.isArray(recipeIngredient) ? recipeIngredient : [recipeIngredient]
        recipeIngredientUnitCount = Array.isArray(recipeIngredientUnitCount) ? recipeIngredientUnitCount : [recipeIngredientUnitCount]
        recipeIngredientUnit = Array.isArray(recipeIngredientUnit) ? recipeIngredientUnit : [recipeIngredientUnit]
        recipeTag = Array.isArray(recipeTag) ? recipeTag : [recipeTag]
        recipeType = Array.isArray(recipeType) ? recipeType : [recipeType]
        recipeTime = Array.isArray(recipeTime) ? recipeTime : [recipeTime]
        recipeSteps = Array.isArray(recipeSteps) ? recipeSteps : [recipeSteps]
        recipeTimeUnit = Array.isArray(recipeTimeUnit) ? recipeTimeUnit : [recipeTimeUnit]

        const userId = req.cookies['logged-user-id'] ?? 'f659951b-43ba-4704-b662-0edb234bba0c'

        const img = await uploadMultipleImages(req.files)
        console.log(img)

        const success = await upload.basicRecipe(userId, recipeName, recipeTag, recipeType, recipeTime, recipeSteps, recipeIngredient, recipeTimeUnit, recipeIngredientUnit, recipeIngredientUnitCount, img)

        if (success.success === true) {
            res.redirect('/recipe/form')
        } else {
            res.send('Algo salio mal').redirect('/recipe/form')
        }

    } catch (error) {
        console.log(error)
    }
})

router.get('/view/:id', async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.cookies['logged-user-id']

        res.render('recipe', { userId: userId, page: 'profile', recipeId: id })
    } catch (error) {
        console.log(error)
    }
})

router.get('/all', async (req, res) => {
    try {
        const recipe = await getRecipes.AllRecipes()
        res.json(recipe).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params

        const recipe = await getRecipes.byRecipeId(id)
        res.json(recipe).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/form/img', (req, res) => {
    res.sendFile(join(__dirname, '../public/recipeImgForm.html'))
})

router.get('/form', (req, res) => {
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