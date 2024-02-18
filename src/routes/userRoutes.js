import express from 'express'

const router = express.Router()

router.get('/:id/favorites', (req, res) => {
    const {id} = req.params
    res.send(`Favoritos del usuario ${id}`)
})

export default router