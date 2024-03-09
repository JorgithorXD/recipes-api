import { supabase } from '../services/supabase.js'

async function basicRecipe(user_id, recipe_name, recipe_tag, recipe_type, recipe_time, recipe_steps, recipe_ingredients, recipe_time_unit, recipe_ingredient_amount, recipe_ingredient_unit, img) {
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
                recipe_img: img
            }]).select('recipe_id')

        if (error) {
            console.log('Error al subir la receta basica: ' + error)
        }

        return { success: true }
    } catch (error) {
        console.log('Un error ocurrio en la receta basica: ' + error)
        return { success: false}
    }
}

export const upload = {
    basicRecipe
}