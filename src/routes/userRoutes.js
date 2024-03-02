import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { register } from '../controllers/singUp.js'
import { checkPassword } from '../controllers/logIn.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


router.get('/:id/favorites', (req, res) => {
    const { id } = req.params
    res.send(`Favoritos del usuario ${id}`)
})

router.get('/form/register', (req, res) => {
    res.sendFile(join(__dirname, '../public/SingIn.html'))
})

router.get('/form/login', (req, res) => {
    res.sendFile(join(__dirname, '../public/logIn.html'))
})

router.post('/login', async (req, res) => {
    try {
        const { emailInput, passwordInput } = req.body

        const { success, id } = await checkPassword(emailInput, passwordInput)

        if (success == true) {
            res.cookie('logged-user-id', id, { httpOnly: true })
            res.redirect('/')
        } else {
            res.send('<h1>Correo o contraseña incorrectos</h1>').redirect('/user/form/login')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', async (req, res) => {
    const { user_name, user_last_name, user_username, user_mail, user_password } = req.body
    const result = await register(user_mail, user_password, user_name, user_username)

    res.send(result)
})

export default router