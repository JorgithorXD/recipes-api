import { supabase } from "../services/supabase.js"

const _All = async (table) => {
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

        return data;
    } catch (error) {
        console.error('Error al obtener datos de Supabase:', error);
        throw error;
    }
}

async function _AllRecipes() {
    try {
        const { data, error } = await supabase
        .from('recipes_relation')
        .select(`
            recipes_basic(
                *
            ),
            recipes_src(
                main_img
            )
        `)

        if (error) {
            throw new Error('Error al obtener recetas con imágenes: ' + error.message);
        }

        return data
    } catch (error) {
        throw new Error('Error al obtener recetas con imágenes: ' + error.message)
    }
}

export const get = {
    _All,
    _AllRecipes
}