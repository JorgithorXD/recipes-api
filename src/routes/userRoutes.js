import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { register } from '../controllers/authMethods/singUp.js'
import { checkPassword, getUserData } from '../controllers/authMethods/logIn.js'
import multer from 'multer'
import { uploadSingleImage } from '../controllers/uploadMethods.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

router.get('/:id/favorites', (req, res) => {
    const { id } = req.params
    res.send(`Favoritos del usuario ${id}`)
})

router.get('/form/register', (req, res) => {
    res.sendFile(join(__dirname, '../public/SingIn.html'))
})

router.get('/form/login', (req, res) => {
    if (req.cookies['logged-user-id'] == null || req.cookies['logged-user-id'] == "" || req.cookies['logged-user-id'] == undefined) {
        res.sendFile(join(__dirname, '../public/logIn.html'))
    } else {
        res.sendFile(join(__dirname, '../public/userProfile.html'))
    }
})

router.post('/login', async (req, res) => {
    try {
        const { emailInput, passwordInput } = req.body

        const { success, id } = await checkPassword(emailInput, passwordInput)

        if (success == true) {
            res.cookie('logged-user-id', id, { httpOnly: true })
            res.redirect('/')
        } else {
            res.send('<h1>Correo o contraseña incorrectos</h1>')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/register', uploads.single('pfp_img'), async (req, res) => {
    try {
        const { user_name, user_last_name, user_username, user_mail, user_password } = req.body

        const pfp = await uploadSingleImage(req.file)

        const { success, error } = await register(user_mail, user_password, user_name, user_username, user_last_name, pfp)

        if (success) {
            res.redirect('/user/form/login')
        } else {
            res.redirect('/user/form/register')
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/get-data/:id', async (req, res) => {
    try {
        const { id } = req.params

        const { data, error } = await getUserData(id)
        console.log(data)
        res.json(data)
    } catch (error) {
        console.log(error)
    }

})

router.get('/profile/:id', async (req, res) => {
    try {
        const userId = req.cookies['logged-user-id']

        res.render('profile', {userId, page: 'profile'})
    } catch (error) {
        console.log(error)
    }
})


export default router