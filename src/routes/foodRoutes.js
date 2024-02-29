import express from 'express'
import { getFoodData } from '../controllers/getFoodData.js'

const router = express.Router()

router.get('/tag', async (req, res) => {
    try {
        const data = await getFoodData.foodTags()
        res.json(data).status(200)
    } catch (error) {
        console.error(error)
    }
})

router.get('/type', async (req, res) => {
    try {
        const data = await getFoodData.foodTypes()
        res.json(data).status(200)
    } catch (error) {
        console.error(error)
    }
})

export default router