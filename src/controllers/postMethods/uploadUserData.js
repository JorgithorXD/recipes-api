import { supabase } from "../../services/supabase.js"
import { getUserFavoriteRecipes } from "../getMethods/getUserData.js"

async function setFavoriteRecipe(id, array) {
    try {
        console.log(array)
        const { data, error: favoriteError } = await supabase
            .from('user_basic_favorites')
            .update({
                recipes_id: array
            })
            .eq('user_id', id)

        if (favoriteError) {
            throw new Error('Error al marcar la receta como favorita: ' + favoriteError)
        }

        return { data }
    } catch (error) {
        console.log(error)
        return {
            data: null,
            error
        }
    }
}

async function updateFavoriteRecipes(id) {
    try {
        const { data } = await getUserFavoriteRecipes(id)

        var recipeFavorite = Array.from(data[0].recipes_id)
        console.log('Array creado: ' + recipeFavorite)

        return recipeFavorite

    } catch (error) {
        console.log(error)
    }
}

export {
    setFavoriteRecipe,
    updateFavoriteRecipes
}