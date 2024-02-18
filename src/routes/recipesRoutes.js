import express from 'express'
import { upload } from '../controllers/uploadRecipe.js'
import { get } from '../controllers/getRecipes.js'

const router = express.Router()

router.get('/all', async (req, res) => {
    try {
        const recipeBasic = await get._AllRecipes('recipes_basic')

        res.json(recipeBasic).status(200)
    } catch (error) {
        console.log('Error ' + error)
    }
})

router.get('/form/post', (req, res) => {
    res.send('<form action="/recipe/post" method="post"><button type="submit">Enviar</button></form>')
})

router.post('/post', async (req, res) => {
    try {
        res.send('HI')
        const TartaDeManzana = {
            recipe_id: "049e8764-9dc9-4899-a330-90b67a66c1d2",
            user_id: "e3c5e974-5f04-4592-98cf-7d0dd52602b0", // El uuid del usuario creador de la receta
            recipe_name: "Tarta de manzana", // Nombre de la receta
            recipe_tag: [1, 2], // Etiquetas de la receta
            recipe_type: [1], // Tipo de la receta
            recipe_time: ["1 hora"], // Tiempo estimado de la receta
            recipe_steps: [
                "1. Precalienta el horno a 180°C.",
                "2. Prepara la masa para la base de la tarta: mezcla la harina, la mantequilla fría y el azúcar hasta obtener una masa homogénea.",
                "3. Forra un molde para tarta con la masa y pincha el fondo con un tenedor.",
                "4. Coloca las rodajas de manzana sobre la masa en el molde.",
                "5. Prepara la cobertura: mezcla la harina, el azúcar y la mantequilla hasta formar migas.",
                "6. Espolvorea las migas sobre las manzanas en el molde.",
                "7. Hornea durante 40-45 minutos o hasta que la tarta esté dorada y las manzanas estén tiernas.",
                "8. Deja enfriar antes de servir. ¡Disfruta tu deliciosa tarta de manzana!"
            ],
            recipe_ingredients: [
                "200 g de harina",
                "100 g de mantequilla fría",
                "50 g de azúcar",
                "3 manzanas (peladas y cortadas en rodajas finas)",
                "100 g de harina (para la cobertura)",
                "100 g de azúcar (para la cobertura)",
                "100 g de mantequilla (para la cobertura)"
            ],
        }
        upload.basicRecipe('recipes_basic', TartaDeManzana)

    } catch (error) {
        console.log('Error al subir la receta' + error)
    }
})
export default router