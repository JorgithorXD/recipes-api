import { supabase } from '../../services/supabase.js'
import bcrypt from 'bcrypt'

const saltRounds = 10

async function singUp(password) {
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds)
        
        const { data, error } = await supabase
            .from('user_private_information')
            .insert([{ user_password: hashPassword }])
            .select()

        if (error) {
            console.error('Error al registrar usuario:', error.message)
            return { success: false, error: error.message }
        } else {
            return { success: true, data }
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error.message)
        return { success: false, error: 'Error interno del servidor' }
    }
}

async function register(email, password, name, username, user_last_name, user_pfp) {
    try {
        const { data, error } = await singUp(password)

        if (error) {
            console.error('Error al registrar usuario:', error.message)
            return { success: false, error: error.message }
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

            if (profileError) {
                console.error('Error al guardar datos personales:', profileError.message);
                return { success: false, error: profileError.message }
            } else {
                console.log('Usuario registrado exitosamente')
                return { success: true }
            }
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error.message)
        return { success: false, error: 'Error interno del servidor' }
    }
}


export {
    singUp,
    register
}