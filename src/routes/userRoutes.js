import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { register } from '../controllers/authMethods/singUp.js'
import { checkPassword, getUserData } from '../controllers/authMethods/logIn.js'
import multer from 'multer'
import { uploadSingleImage, uploadImageWithoutBuffer } from '../controllers/postMethods/uploadMethods.js'
import { getUserDataWithRecipes, getUserFavoriteRecipes, getAllUserData } from '../controllers/getMethods/getUserData.js'
import { setFavoriteRecipe, updateFavoriteRecipes } from '../controllers/postMethods/uploadUserData.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.memoryStorage()
const uploads = multer({ storage: storage })

// Endpoints de la APIRest 

router.post('/auth/login', async (req, res) => {
    try {
        const { emailInput, passwordInput } = req.body

        const { success, error, id } = await checkPassword(emailInput, passwordInput)

        if (!success) {
            res.json({
                message: 'Ha ocurrido un error',
                status: 'Error',
                error,
                id: null
            })
        } else {
            res.json({
                message: 'Inicio de sesion exitoso',
                status: 'Success',
                id,
                error
            })
        }

    } catch (error) {
        res.json({
            message: 'Ha ocurrido un error',
            status: 'Error',
            error
        })
    }
})


router.post('/auth/register', async (req, res) => {
    try {
        const { img, username, name, lastname, email, password } = req.body
        var url

        if (!img || !img.base64 || img.base64 === "" || img.base64.length < 1) {
            url = 'https://ik.imagekit.io/uv3u01crv/User_default.webp'
        } else {
            const buffer = Buffer.from(img.base64, 'base64')
            url = await uploadImageWithoutBuffer(buffer, img.fileName)
        }

        const { data, error, message, status, errorMessage } = await register(email, password, name, username, lastname, url)

        if (error || status == 'Error') {
            throw new Error('Ocurrio un error: ' + error + "\n Mensaje: " + errorMessage)
        }

        res.json(
            {
                id: data[0].user_id,
                status: status,
                message: message,
                error: false,
                errorMessage: null
            }
        )
    } catch (error) {
        res.json({
            id: null,
            error: error,
        })
    }
})

router.post('/add/favorite/:user_id/recipe/:recipe_id', async (req, res) => {
    try {
        const { user_id, recipe_id } = req.params

        var favoriteArray = await updateFavoriteRecipes(user_id)

        if (favoriteArray.includes(recipe_id)) {
            res.json({
                message: 'La receta ya esta agregada',
                status: 'Fail',
            })
        } else {
            favoriteArray.push(recipe_id)

            const { data } = await setFavoriteRecipe(user_id, favoriteArray)
            console.log(data)
            res.json({
                message: 'Receta agregada a favoritos',
                status: 'Success',
            })
        }
    } catch (error) {
        res.json({
            message: error,
            status: 'Error',
        })
    }
})

router.get('/get-data/:id', async (req, res) => {
    try {
        const { id } = req.params

        const data = await getAllUserData(id)

        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

router.get('/get-data/:id/favorites', async (req, res) => {
    try {
        const { id } = req.params

        const data = await getUserFavoriteRecipes(id)

        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

router.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await getAllUserData(id)

        res.json(data)
    } catch (error) {
        console.log(error)
    }
})

// Endpoints de la pagina

router.get('/view/test/form', (req, res) => {
    res.sendFile(join(__dirname, '../public/test.html'))
})

router.post('/api/test', async (req, res) => {
    try {
        const { img } = req.body

        const buffer = Buffer.from(img.base64, 'base64')

        const url = await uploadImageWithoutBuffer(buffer, img.fileName)

        res.json(
            {
                name: img.fileName,
                buffer: buffer,
                url: url
            }
        )
    } catch (error) {
        res.json(error)
    }
})

router.get('/view/form/register', (req, res) => {
    res.sendFile(join(__dirname, '../public/SingIn.html'))
})

router.get('/view/form/login', (req, res) => {
    if (req.cookies['logged-user-id'] == null || req.cookies['logged-user-id'] == "" || req.cookies['logged-user-id'] == undefined) {
        res.render('logIn')
    } else {
        res.sendFile(join(__dirname, '../public/userProfile.html'))
    }
})

router.post('/view/auth/register', uploads.single('pfp_img'), async (req, res) => {
    try {
        const { user_name, user_last_name, user_username, user_mail, user_password } = req.body
        var pfp

        if (req.file) {
            pfp = await uploadSingleImage(req.file)
        } else {
            pfp = 'https://ik.imagekit.io/uv3u01crv/User_default.webp'
        }

        const { error, errorMessage, message, status, data } = await register(user_mail, user_password, user_name, user_username, user_last_name, pfp)

        if (error) {
            throw new Error(message + errorMessage)
        }

        if (status == 'Success') {
            res.cookie('logged-user-id', data, { httpOnly: true })
            res.redirect('/')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/view/auth/login', async (req, res) => {
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

router.get('/view/profile/:id', async (req, res) => {
    try {
        const { id } = req.params
        const data = await getAllUserData(id)

        res.render('profile', { userId: id, page: 'profile', userData: data, message: null, error: null })
    } catch (error) {
        console.log(error)
    }
})

router.post('/profile/close', async (req, res) => {
    try {
        res.clearCookie('logged-user-id')
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})


export default router