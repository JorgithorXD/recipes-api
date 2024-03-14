import { supabase } from "../../services/supabase.js"

const foodTags = async ()=> {
    try {
        const { data, error } = await supabase
            .from('food_tag')
            .select('*')

        if (error) {
            throw error
        }

        if (!data || data.length === 0) {
            console.warn(`No hay datos en la tabla ${table}`)
            return []
        }

        return data
    } catch (error) {
        console.error('Error al obtener datos de Supabase:', error)
        throw error
    }
}

const foodTypes = async ()=> {
    try {
        const { data, error } = await supabase
            .from('food_category')
            .select('*')

        if (error) {
            throw error
        }

        if (!data || data.length === 0) {
            console.warn(`No hay datos en la tabla ${table}`)
            return []
        }

        return data
    } catch (error) {
        console.error('Error al obtener datos de Supabase:', error)
        throw error
    }
}

const foodUnits = async ()=> {
    try {
        const { data, error } = await supabase
            .from('food_units')
            .select('*')

        if (error) {
            throw error
        }

        if (!data || data.length === 0) {
            console.warn(`No hay datos en la tabla ${table}`)
            return []
        }

        return data
    } catch (error) {
        console.error('Error al obtener datos de Supabase:', error)
        throw error
    }
}

export const getFoodData = {
    foodTags,
    foodTypes,
    foodUnits
}