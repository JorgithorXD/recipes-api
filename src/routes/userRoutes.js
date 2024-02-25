import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import {register } from '../controllers/singUp.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


router.get('/:id/favorites', (req, res) => {
    const {id} = req.params
    res.send(`Favoritos del usuario ${id}`)
})

router.get('/form/register', (req, res) => {
    res.sendFile(join(__dirname, '../public/formUser.html'))
})

router.post('/register', async (req, res) => {
    const {user_name, user_last_name, user_username, user_mail, user_password} = req.body
    await register( user_mail, user_password, user_name, user_username)
})

export default router