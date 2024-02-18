import {supabase} from '../services/supabase.js'

const basicRecipe = async (table, data) => {
    const {result, error} = await supabase
    .from(table)
    .upsert(data)

    if (error) {
        console.error('Error: ' + error.message)
        return;
    }

    console.log('Recipe uploaded successfully: ', result)
}

export const upload = {
    basicRecipe
}