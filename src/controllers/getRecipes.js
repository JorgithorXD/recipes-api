import { supabase } from "../services/supabase.js"

const All = async (table) => {
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

async function AllRecipes() {
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

async function byId(id) {
    try {
        const { data, error } = await supabase
        .from('recipes_basic')
        .select('*')
        .eq('user_id', id)

        if (error) {
            throw new Error('Error al obtener recetas con imágenes: ' + error.message);
        }

        return {data}
    } catch (error) {
        throw new Error('Error al obtener recetas con imágenes: ' + error.message)
    }
}


export const getRecipes = {
    All,
    AllRecipes,
    byId
}