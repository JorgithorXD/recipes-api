import express from 'express'
import { upload } from '../controllers/postMethods/uploadRecipe.js'
import { getAllRecipes, getBasicRecipeInformation, getRecipeByRecipeId } from '../controllers/getMethods/getRecipes.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import multer from 'multer'
import { uploadSingleImage, uploadMultipleImages } from '../controllers/postMethods/uploadMethods.js'
import { isLogged } from '../controllers/middelwares.js'
import fs from 'fs/promises'
import { getUserFavoriteRecipes } from '../controllers/getMethods/getUserData.js'
import { getFoodData } from '../controllers/getMethods/getFoodData.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.memoryStorage();
const uploads = multer({
    storage: storage,
    preservePath: true
})

router.post('/all-data', uploads.fields([{ name: 'recipeImage', maxCount: 1 }, { name: 'stepImage' }]), async (req, res) => {
    try {
        var { recipeName, recipeType, recipeTag, recipeTime, recipeTimeUnit, recipeIngredient, recipeIngredientUnit, recipeIngredientUnitCount, recipeSteps, haveFile } = req.body

        console.log(haveFile)

        recipeIngredient = Array.isArray(recipeIngredient) ? recipeIngredient : [recipeIngredient]
        recipeIngredientUnitCount = Array.isArray(recipeIngredientUnitCount) ? recipeIngredientUnitCount : [recipeIngredientUnitCount]
        recipeIngredientUnit = Array.isArray(recipeIngredientUnit) ? recipeIngredientUnit : [recipeIngredientUnit]
        recipeTag = Array.isArray(recipeTag) ? recipeTag : [recipeTag]
        recipeType = Array.isArray(recipeType) ? recipeType : [recipeType]
        recipeTime = Array.isArray(recipeTime) ? recipeTime : [recipeTime]
        recipeSteps = Array.isArray(recipeSteps) ? recipeSteps : [recipeSteps]
        recipeTimeUnit = Array.isArray(recipeTimeUnit) ? recipeTimeUnit : [recipeTimeUnit]
        haveFile = Array.isArray(haveFile) ? haveFile : [haveFile]

        const userId = req.cookies['logged-user-id'] ?? 'f659951b-43ba-4704-b662-0edb234bba0c'
        console.log(req.files)

        const img = await uploadSingleImage(req.files.recipeImage[0])
        var stepImg

        if (req.files.stepImage.length) {
            stepImg = await uploadMultipleImages(req.files.stepImage)
        } else {
            stepImg = []
        }

        const success = await upload.basicRecipe(userId, recipeName, recipeTag, recipeType, recipeTime, recipeSteps, recipeIngredient, recipeTimeUnit, recipeIngredientUnit, recipeIngredientUnitCount, img, haveFile, stepImg)

        if (success.success === true) {
            res.redirect('/recipe/form')
        } else {
            res.send('Algo salio mal')
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

router.get('/all/view', async (req, res) => {
    try {
        const recipes = await getAllRecipes()
        const userId = req.cookies['logged-user-id']

        res.render('allRecipes', { data: recipes, userId: userId, page: 'all_recipes' })
    } catch (error) {

    }
})

router.get('/all', async (req, res) => {
    try {
        const recipe = await getAllRecipes()
        res.json(recipe).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/basic/get/all', async (req, res) => {
    try {
        const recipeData = await getBasicRecipeInformation()
        const typeData = await getFoodData.foodTypes()
        const tagData = await getFoodData.foodTags()

        const recipe = recipeData.map(recipe => {
            const tags = tagData.filter(tag => recipe.recipe_tag.some(tagId => tag.tag_id === tagId))
            const types = typeData.filter(type => recipe.recipe_type.some(tagId => type.categoty_id === tagId))
            const timeU = recipe.recipe_time_unit.map(unit => {
                if (unit === 1) {
                    return "Minutos"
                } else if (unit === 2) {
                    return "Horas"
                } else {
                    return "Desconocido"
                }
            })

            return {
                recipe: {
                    id: recipe.recipe_id,
                    name: recipe.recipe_name,
                    mainImg: recipe.recipe_img,
                    tag: {
                        count: tags.length,
                        tags: tags.map(tag => {
                            return {
                                key: tag.tag_id,
                                value: tag.name,
                            }
                        })
                    },
                    category: {
                        count: types.length,
                        tags: types.map(type => {
                            return {
                                key: type.categoty_id,
                                value: type.category,
                            }
                        })
                    },
                    time: {
                        from: `${recipe.recipe_time[0]} ${timeU[0]}`,
                        to: `${recipe.recipe_time[1]} ${timeU[1]}`
                    }
                }
            }
        })

        res.json(recipe).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/get/:id', async (req, res) => {
    try {
        const { id } = req.params

        const recipe = await getRecipeByRecipeId(id)
        res.json(recipe).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/form/img', (req, res) => {
    res.sendFile(join(__dirname, '../public/recipeImgForm.html'))
})

router.get('/form', async (req, res) => {
    try {
        const typeData = await getFoodData.foodTypes()
        const tagData = await getFoodData.foodTags()
        const unitData = await getFoodData.foodUnits()

        console.log(typeData)
        console.log(tagData)
        console.log(unitData)

        res.render('recipeForm', { typeData, tagData, unitData })
    } catch (error) {

        console.log(error)
    }
})

router.post('/post', async (req, res) => {
    try {

        upload.basicRecipe('recipes_basic', TartaDeManzana)

    } catch (error) {
        console.log('Error al subir la receta' + error)
    }
})

export default router