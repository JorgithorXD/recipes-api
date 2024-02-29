import { supabase } from '../services/supabase.js'

async function singUp(email, password) {
    try {
        const { data, error } = await supabase
            .from('user_private_information')
            .insert([{ user_email: email, user_password: password }])
            .select()

        if (error) {
            console.error('Error al registrar usuario:', error.message)
            return { success: false, error: error.message }
        } else {
            console.log('Usuario registrado exitosamente')
            return { success: true, data }
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error.message)
        return { success: false, error: 'Error interno del servidor' }
    }
}

async function register(email, password, name, username) {
    try {
        const { data, error } = await singUp(email, password)

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