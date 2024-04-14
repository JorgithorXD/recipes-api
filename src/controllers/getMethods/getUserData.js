import { supabase } from "../../services/supabase.js"
import { getUserData } from "../authMethods/logIn.js"
import { getRecipeByUserId } from "./getRecipes.js"

async function getUserDataWithRecipes(id) {
    try {
        const { data: user, error: userError } = await getUserData(id)
        const { data: userRecipes, error: recipesError } = await getRecipeByUserId(id)

        if (userError || recipesError) {
            throw new Error('Error al obtener datos del usuario o recetas')
        }

        const userDataWithRecipes = {
            user: user[0],
            recipeCount: userRecipes.length,
            recipes: userRecipes
        }

        return userDataWithRecipes
    } catch (error) {
        console.log('Error: ' + error)
    }
}

async function getUserFavoriteRecipes(id) {
    try {
        const { data, error } = await supabase
            .from('user_basic_favorites')
            .select('recipes_id')
            .eq('user_id', id)

        if (error) {
            throw new Error('Error al obtener datos del usuario')
        }

        return { data }
    } catch (error) {
        console.log(error)
    }
}

async function getAllUserData(id) {
    try {
        const { data: user, error: userError } = await getUserData(id)
        const { data: userRecipes, error: recipesError } = await getRecipeByUserId(id)
        const { data: userFavorites, error: favoriteError } = await getUserFavoriteRecipes(id)

        if (userError || recipesError || favoriteError) {
            throw new Error('Error al obtener datos del usuario o recetas')
        }

        const allUserData = {
            user: user[0],
            recipeCount: userRecipes.length,
            recipes: userRecipes,
            favoriteRecipes: userFavorites[0]
        }

        return allUserData
    } catch (error) {

    }
}

async function getUserById(id) {
    try {
        const { data, error: userError } = await getUserData(id)

        if (userError) {
            throw new Error('Error al obtener datos del usuario: ' + userError.message)
        }

        return data[0].user_username
    } catch (error) {

    }
}

export {
    getAllUserData,
    getUserById, getUserDataWithRecipes,
    getUserFavoriteRecipes
}
