import { supabase } from '../services/supabase.js'

async function basicRecipe(user_id, recipe_name, recipe_tag, recipe_type, recipe_time, recipe_steps, recipe_ingredients) {
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
                recipe_ingredients: recipe_ingredients
            }]).select('recipe_id')

        if (error) {
            console.log('Error al subir la receta basica: ' + error.message)
        }

        return { data }
    } catch (error) {
        console.log('Un error ocurrio en la receta basica: ' + error)
    }
}

async function srcRecipe(img) {
    try {
        const { data, error } = await supabase
            .from('recipes_img')
            .upsert([{
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
            .upsert([{
                recipe_id: id,
                img_id
            }])

        if (error) {
            console.log('Error al subir la relacion: ' + error.message)
        }

        return { data }
    } catch (error) {
        console.log(error)
    }
}

async function recipe(user_id, recipe_name, recipe_tag, recipe_type, recipe_time, recipe_steps, recipe_ingredients, img) {
    try {
        recipe_tag = Array.isArray(recipe_tag) ? recipe_tag : [recipe_tag]
        recipe_type = Array.isArray(recipe_type) ? recipe_type : [recipe_type]
        recipe_time = Array.isArray(recipe_time) ? recipe_time : [recipe_time]
        recipe_steps = Array.isArray(recipe_steps) ? recipe_steps : [recipe_steps]
        recipe_ingredients = Array.isArray(recipe_ingredients) ? recipe_ingredients : [recipe_ingredients]

        const { data: id } = await basicRecipe(user_id, recipe_name, recipe_tag, recipe_type, recipe_time, recipe_steps, recipe_ingredients)
        var recipe_id = id[0].recipe_id
        console.log(recipe_id)

        const { data: img_id_ } = await srcRecipe(img)
        var img_id = img_id_[0].img_id
        console.log(img_id)

        const { data: result } = await relation(recipe_id, img_id)
        console.log(result)

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