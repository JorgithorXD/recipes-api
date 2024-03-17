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

async function removeFavoriteRecipes(id, recipeID) {
    try {
        const { data } = await getUserFavoriteRecipes(id)

        let recipeFavorite = Array.from(data[0].recipes_id)

        if (recipeFavorite.includes(recipeID)) {
            recipeFavorite.splice(recipeID)
            console.log('Eliminado: ' + recipeFavorite)
        } else {
            throw new Error('La receta no se encuentra marcada como favorita')
        }
    } catch (error) {
        console.log(error)
    }
}

async function updateFavoriteRecipes(id) {
    try {
        const { data } = await getUserFavoriteRecipes(id)

        let recipeFavorite = []
        if (data[0] && data[0].recipes_id !== null) {
            recipeFavorite = Array.from(data[0].recipes_id)
            console.log('Array creado: ' + recipeFavorite)
        } else {
            console.log('No se encontraron recetas favoritas para el usuario o la lista de recetas está vacía')
        }

        return recipeFavorite
    } catch (error) {
        console.log(error)
    }
}

export {
    setFavoriteRecipe,
    updateFavoriteRecipes
}