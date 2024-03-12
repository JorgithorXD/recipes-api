import { supabase } from "../services/supabase.js"
import { getUserData } from "./authMethods/logIn.js"
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

export {
    getUserDataWithRecipes
}