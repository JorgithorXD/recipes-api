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

router.post('/all-data', uploads.fields([{ name: 'recipeImage', maxCount: 1 }]), async (req, res) => {
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

        const userId = req.cookies['logged-user-id'] ?? '66cc5465-8cac-4462-97a0-707a6652e32f'

        const img = await uploadSingleImage(req.files.recipeImage[0])

        const success = await upload.basicRecipe(userId, recipeName, recipeTag, recipeType, recipeTime, recipeSteps, recipeIngredient, recipeTimeUnit, recipeIngredientUnit, recipeIngredientUnitCount, img)

        if (success) {
            res.json({
                status: 'OK',
                message: 'La receta fue subida'
            })
        } else {
            throw new Error('Error al subir la receta.');
        }
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error.message
        })
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

router.get('/get/all', async (req, res) => {
    try {
        const recipeData = await getAllRecipes()
        const typeData = await getFoodData.foodTypes()
        const tagData = await getFoodData.foodTags()
        const unitsData = await getFoodData.foodUnits()

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
            const unit = unitsData.filter(u => recipe.recipe_ingredient_amount.some(id => u.filter_id === id))
            console.log(unitsData)

            return {
                id: recipe.recipe_id,
                owner: recipe.user_id,
                name: recipe.recipe_name,
                mainImg: recipe.recipe_img,
                addedAt: recipe.created_at,
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
                },
                ingredients: {
                    count: recipe.recipe_ingredients.length,
                    ingredients: recipe.recipe_ingredients.map((ingredient, i) => {
                        const unit = unitsData.find(unit => unit.filter_id === recipe.recipe_ingredient_amount[i])

                        return {
                            name: ingredient,
                            amount: recipe.recipe_ingredient_unit[i],
                            unit: {
                                key: unit.filter_id,
                                value: unit.unit
                            }
                        }
                    })
                },
                steps: {
                    count: recipe.recipe_steps.length,
                    steps: recipe.recipe_steps,
                }
            }
        })

        res.json(recipe).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/get/all/basic', async (req, res) => {
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
                },

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