const _Basic = {
    recipe_id: null,
    user_id: null,
    recipe_name: null,
    recipe_tag: [],
    recipe_type: [],
    recipe_time: [],
    recipe_steps: [],
    recipe_ingredients: []
}

const basicCard = async (data) => {
    const recipe = {
        id: data.recipe_id
    }
    return recipe
}

export {
    _Basic,
    basicCard
}