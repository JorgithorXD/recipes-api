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
            .select('*')

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

export {
    getAllFrom,
    getAllRecipes,
    getRecipeByUserId,
    getRecipeByRecipeId,
    getBasicRecipeInformation
}