import { supabase } from "../../services/supabase.js"

const getAllFrom = async (table) => {
    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            console.warn(`No hay datos en la tabla ${table}`);
            return [];
        }

        return data
    } catch (error) {
        console.error('Error al obtener datos de Supabase:', error);
        throw error;
    }
}

async function getAllRecipes() {
    try {
        const { data, error } = await supabase
            .from('recipes_basic')
            .select('*, user_basic_information(user_username)')

        if (error) {
            throw new Error('Error al obtener las recetas: ' + error.message);
        }

        return data
    } catch (error) {
        throw new Error('Error al obtener recetas con imágenes: ' + error.message)
    }
}

async function getRecipeByCategory(cat) {
    try {
        const { data, error } = await supabase
            .from('recipes_basic')
            .select('*, user_basic_information(user_username)')
            .overlaps('recipe_type', [cat])

        if (error) {
            throw new Error('Error al obtener las recetas: ' + error.message);
        }

        return data
    } catch (error) {
        throw new Error('Error al obtener recetas con imágenes: ' + error.message)
    }
}

async function getRecipeByUserId(id) {
    try {
        const { data, error } = await supabase
            .from('recipes_basic')
            .select('*')
            .eq('user_id', id)

        if (error) {
            throw new Error('Error al obtener recetas con imágenes: ' + error.message);
        }

        return { data, error }
    } catch (error) {
        throw new Error('Error al obtener recetas con imágenes: ' + error.message)
    }
}

async function getRecipeByRecipeId(id) {
    try {
        const { data, error } = await supabase
            .from('recipes_basic')
            .select('*')
            .eq('recipe_id', id)

        if (error) {
            throw new Error('Error al obtener recetas con imágenes: ' + error.message);
        }

        return { data }
    } catch (error) {
        throw new Error('Error al obtener recetas con imágenes: ' + error.message)
    }
}

async function getBasicRecipeInformation() {
    try {
        const { data, error } = await supabase
            .from('recipes_basic')
            .select(`
                recipe_id,
                user_id,
                recipe_name,
                recipe_tag,
                recipe_type,
                recipe_time,
                recipe_time_unit,
                recipe_img
            `)

        if (error) {
            throw new Error('Error al obtener las recetas: ' + error.message);
        }

        return data
    } catch (error) {
        throw new Error('Error al obtener recetas con imágenes: ' + error.message)
    }
}

async function getRandomRecipe() {
    try {
        const { data, error } = await supabase
            .from('random_recipe_2')
            .select('*')
            .limit(1)
            .single()

        if (error) throw new Error(error.message)

        return {
            data, error
        }

    } catch (error) {
        throw new Error('Error al obtener la reeceta aleatoria: ' + error.message)
    }
}

export {
    getAllFrom,
    getAllRecipes,
    getRecipeByUserId,
    getRecipeByRecipeId,
    getBasicRecipeInformation,
    getRecipeByCategory,
    getRandomRecipe
}