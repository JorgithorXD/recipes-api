import { supabase } from "../services/supabase.js"

const _AllRecipes = async (table) => {
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

export const get = {
    _AllRecipes
}