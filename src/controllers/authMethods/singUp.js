import { supabase } from '../../services/supabase.js'
import bcrypt from 'bcrypt'

async function singUp(password) {
    try {
        const hashPassword = await bcrypt.hash(password, 12)

        const { data, error } = await supabase
            .from('user_private_information')
            .insert([{ user_password: hashPassword }])
            .select()

        if (error || !data || data.length === 0) {
            throw new Error('Ha ocurrido un error al registrar al usuario: ' + error.details)
        } else {
            return { success: true, data }
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

async function register(email, password, name, username, user_last_name, user_pfp) {
    try {
        const { success, data, error } = await singUp(password)

        if (error || !success) {
            throw new Error('Error al registrar al usuario: ' + error)

        } else {
            const userId = data[0].user_id

            const { data: basicData, error: profileError } = await supabase
                .from('user_basic_information')
                .insert([
                    {
                        user_id: userId,
                        user_name: name,
                        user_username: username,
                        user_pfp,
                        user_email: email,
                        user_last_name
                    },
                ])
                .select('user_id')

            if (profileError) {
                throw new Error('Ocurrio un error al crear la cuenta: ' + profileError.message)
            } else {
                return {
                    data: basicData,
                    error: false,
                    errorMessage: null,
                    message: 'Cuenta creada correctamente.',
                    status: 'Success'
                }
            }
        }
    } catch (error) {
        return {
            data: null,
            error: true,
            errorMessage: error,
            message: 'Hubo un error al crear la cuenta.',
            status: 'Error'
        }
    }
}


export {
    singUp,
    register
}