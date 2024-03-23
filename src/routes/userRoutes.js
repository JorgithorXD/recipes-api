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

router.post('/view/login', async (req, res) => {
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

router.post('/register', uploads.single('pfp_img'), async (req, res) => {
    try {
        const { user_name, user_last_name, user_username, user_mail, user_password } = req.body
        var pfp

        if (req.file) {
            console.log(req.file)
        } else {
            pfp = 'https://ik.imagekit.io/uv3u01crv/User_default.webp'
        }

        const { success, error } = await register(user_mail, user_password, user_name, user_username, user_last_name, pfp)

        if (error) {
            throw new Error('Hubo un error al crear la cuenta')
        }

        res.json(success)
    } catch (error) {
        console.log(error)
    }
})

router.post('/auth/v2/register', uploads.any('pfp_img'),async (req, res) => {
    try {
        console.log(req.file)
        /*const { user_name, user_last_name, user_username, user_mail, user_password} = req.body

        if (req.file) {
            pfp = await uploadImageWithoutBuffer(req.file)
        } else {
            pfp = 'https://ik.imagekit.io/uv3u01crv/User_default.webp'
        }

        const { success, error } = await register(user_mail, user_password, user_name, user_username, user_last_name, pfp)

        if (error) {
            throw new Error('Hubo un error al crear la cuenta')
        }

        res.json(success)*/
    } catch (error) {
        console.log(error)
    }
})

router.post('/view/register', uploads.single('pfp_img'), async (req, res) => {
    try {
        const { user_name, user_last_name, user_username, user_mail, user_password } = req.body
        var pfp

        if (req.file) {
           pfp = await uploadSingleImage(req.file)
            console.log(req.file)
        } else {
            pfp = 'https://ik.imagekit.io/uv3u01crv/User_default.webp'
        }

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

router.get('/profile/view/:id', async (req, res) => {
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

router.post('/set/:user_id/favorite/:recipe_id', async (req, res) => {
    try {
        const { user_id, recipe_id } = req.params

        var favoriteArray = await updateFavoriteRecipes(user_id)

        if (favoriteArray.includes(recipe_id)) {
            res.json({
                data: 'La receta ya esta agregada',
            })
        } else {
            favoriteArray.push(recipe_id)

            const { data } = await setFavoriteRecipe(user_id, favoriteArray)
            console.log(data)
            res.json({
                data: 'Receta añadida a favoritos'
            })
        }
    } catch (error) {

    }
})

export default router