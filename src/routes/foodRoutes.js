import express from 'express'
import { getFoodData } from '../controllers/getMethods/getFoodData.js'

const router = express.Router()

router.get('/get/tag', async (req, res) => {
    try {
        const data = await getFoodData.foodTags()
        res.json(data).status(200)
    } catch (error) {
        console.error(error)
    }
})

router.get('/get/type', async (req, res) => {
    try {
        const data = await getFoodData.foodTypes()
        res.json(data).status(200)
    } catch (error) {
        console.error(error)
    }
})

router.get('/get/units', async (req, res) => {
    try {
        const data = await getFoodData.foodUnits()
        res.json(data).status(200)
    } catch (error) {
        console.error(error)
    }
})

export default router