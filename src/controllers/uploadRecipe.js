import { supabase } from '../services/supabase.js'

async function basicRecipe(user_id, recipe_name, recipe_tag, recipe_type, recipe_time, recipe_steps, recipe_ingredients, recipe_time_unit, recipe_ingredient_amount, recipe_ingredient_unit) {
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
                recipe_ingredient_unit: recipe_ingredient_unit
            }]).select('recipe_id')

        if (error) {
            console.log('Error al subir la receta basica: ' + error)
        }

        return { data }
    } catch (error) {
        console.log('Un error ocurrio en la receta basica: ' + error)
    }
}

async function srcRecipe(img) {
    try {
        const { data, error } = await supabase
            .from('recipes_src')
            .insert([{
                img: img
            }])
            .select(
                'img_id'
            )

        if (error) {
            console.log('Error al subir la imagen: ' + error.message)
        }

        return { data }
    } catch (error) {
        console.log(error)
    }
}

async function relation(id, img_id) {
    try {
        const { data, error } = await supabase
            .from('recipes_relation')
            .insert([{
                recipe_id: id,
                img_id: img_id
            }])

        if (error) {
            console.log('Error al subir la relacion: ' + error.message)
        }

        return { data }
    } catch (error) {
        console.log(error)
    }
}

async function recipe(user_id, recipe_name, recipe_tag, recipe_type, recipe_time, recipe_steps, recipe_ingredients, img, recipe_time_unit, recipe_ingredient_amount, recipe_ingredient_unit) {
    try {
        const { data: id } = await basicRecipe(user_id, recipe_name, recipe_tag, recipe_type, recipe_time, recipe_steps, recipe_ingredients, recipe_time_unit, recipe_ingredient_amount, recipe_ingredient_unit)
        var recipe_id = id[0].recipe_id
        console.log('Id de la receta: ' + recipe_id)

        const { data: img_id_ } = await srcRecipe(img)
        var img_id = img_id_[0].img_id
        console.log('Id de las imagenes: ' + img_id)

        const { data: result } = await relation(recipe_id, img_id)
        console.log('Resultado ' + result)

        return { success: true }

    } catch (error) {
        console.log('Error al subir la receta ' + error)
    }
}

export const upload = {
    basicRecipe,
    srcRecipe,
    relation,
    recipe
}