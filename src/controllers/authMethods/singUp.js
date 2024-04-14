import { supabase } from '../../services/supabase.js'
import bcrypt from 'bcrypt'

async function singUp(userId, password) {
    try {
        const hashPassword = await bcrypt.hash(password, 12)

        const { data, error } = await supabase
            .from('user_private_information')
            .insert([{
                user_id: userId,
                user_password: hashPassword
            }])

        if (error) throw new Error('Ha ocurrido un error al registrar al usuario: ' + error.message)

        return { success: true, error: null }

    } catch (error) {
        return { success: false, error: error.message }
    }
}

async function registerFavorites(id) {
    try {
        const { data, error } = await supabase
            .from('user_basic_favorites')
            .insert([
                {
                    user_id: id
                },
            ])

        if (error) throw new Error(error.message)

        return {
            status: 'OK'
        }
    } catch (error) {
        return {
            data: null,
            error: true,
            errorMessage: error.message,
            message: 'Hubo un error al crear la cuenta.',
            status: 'Error'
        }
    }
}

async function register(email, password, name, username, user_last_name, user_pfp) {
    try {
        const { data: basicData, error: profileError } = await supabase
            .from('user_basic_information')
            .insert([
                {
                    user_name: name,
                    user_username: username,
                    user_pfp,
                    user_email: email,
                    user_last_name
                },
            ])
            .select('user_id')

        const { error, success } = await singUp(basicData[0].user_id, password)
        const { status } = await registerFavorites(basicData[0].user_id)

        if (profileError) throw new Error('Ocurrio un error al crear la cuenta: ' + profileError.message)
        if (!success) throw new Error(error)

        return {
            data: basicData[0].user_id,
            error: false,
            errorMessage: null,
            message: 'Cuenta creada correctamente.',
            status: 'Success'
        }

    } catch (error) {
        return {
            data: null,
            error: true,
            errorMessage: error.message,
            message: 'Hubo un error al crear la cuenta.',
            status: 'Error'
        }
    }
}


export {
    singUp,
    register
}