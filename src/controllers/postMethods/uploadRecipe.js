import { supabase } from '../../services/supabase.js'

async function basicRecipe(user_id, recipe_name, recipe_tag, recipe_type, recipe_time, recipe_steps, recipe_ingredients, recipe_time_unit, recipe_ingredient_amount, recipe_ingredient_unit, img, recipe_description) {
    try {
        const { data, error } = await supabase
            .from('recipes_basic')
            .insert([{
                user_id: user_id,
                recipe_name: recipe_name,
                recipe_tag: recipe_tag,
                recipe_type: recipe_type,
                recipe_time: recipe_time,
                recipe_steps: recipe_steps,
                recipe_ingredients: recipe_ingredients,
                recipe_time_unit: recipe_time_unit,
                recipe_ingredient_amount: recipe_ingredient_amount,
                recipe_ingredient_unit: recipe_ingredient_unit,
                recipe_img: img,
                recipe_description: recipe_description
            }]).select('recipe_id')

        if (error) {
            console.log('Error al subir la receta basica: ' + error.message)
        }

        return { success: true }
    } catch (error) {
        console.log('Un error ocurrio en la receta basica: ' + error)
        return { success: false }
    }
}

async function calicateRecipe(score, user_id, recipe_id) {
    try {
        const { data, error } = await supabase
            .from('recipes_basic_score')
            .upsert(
                {
                    recipe_id: recipe_id,
                    user_id: user_id,
                    score: score
                }
            )

        if (error) throw new Error(error.message)

        return {
            data: 'Receta calificada',
            error: false,
            errorMessage: null
        }

    } catch (error) {
        return {
            data: 'La receta no se pudo calificar',
            error: true,
            errorMessage: error.message
        }
    }
}

export const upload = {
    basicRecipe,
    calicateRecipe
}