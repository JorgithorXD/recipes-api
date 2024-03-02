import { supabase } from "../services/supabase.js"

async function getUserId(email) {
    try {
        const { data, error } = await supabase
            .from('user_basic_information')
            .select('user_id')
            .eq('user_email', email)

        if (error) {
            throw error
        }
        console.log(data[0].user_id)
        return data[0].user_id

    } catch (error) {
        console.log(error)
    }
}

async function getPrivateInfo(id) {
    try {
        const { data, error } = await supabase
            .from('user_private_information')
            .select('user_password')
            .eq('user_id', id)

        if (error) {
            throw error
        }

        return data[0].user_password

    } catch (error) {
        console.log(error)
    }
}

async function checkPassword(email, password) {
    try {
        const id = await getUserId(email)
        const dbPassword = await getPrivateInfo(id)

        if (password = dbPassword) {
            return {
                success: true,
                id
            }
        } else {
            return { success: false }
        }
    } catch (error) {
        console.log(error)
    }
}

export {
    checkPassword
}