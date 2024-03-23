import { supabase } from "../../services/supabase.js"
import { comparePasswords } from "./decrypPassword.js"

async function getUserId(email) {
    try {
        const { data, error } = await supabase
            .from('user_basic_information')
            .select('user_id')
            .eq('user_email', email)

        if (!data || data.length === 0) {
            throw new Error('No se encontró el correo especificado')
        }
        return {
            id: data[0].user_id,
            error
        }

    } catch (error) {
        console.log(error)
        return {
            id: null,
            error
        }
    }
}

async function getUserData(id) {
    try {
        const { data, error } = await supabase
            .from('user_basic_information')
            .select('*')
            .eq('user_id', id)

        if (error) {
            throw new Error('Ha ocurrido un error al obtener los datos del usuario: ' + error.message)
        }

        return { data, error }

    } catch (error) {
        console.log(error)
        return { data: null, error }
    }
}

async function getPrivateInfo(id) {
    try {
        const { data, error } = await supabase
            .from('user_private_information')
            .select('user_password')
            .eq('user_id', id)

        if (error) {
            throw new Error('Error al obtener la contraseña del usuario: ' + error.message)
        }

        if (!data || data.length === 0 || !data[0].user_password) {
            throw new Error('No se encontró la contraseña del usuario')
        }

        return {
            password: data[0].user_password,
            error
        }

    } catch (error) {
        console.log('Error al obtener la contraseña del usuario: ' + error)
        return {
            password: null,
            error
        }
    }
}

async function checkPassword(email, userPassword) {
    try {
        const { id, error: idError } = await getUserId(email)
        const { password, error: passwordError } = await getPrivateInfo(id)
        
        if (idError && passwordError) {
            throw new Error('La cuenta no existe')
        }
        if (idError) {
            throw new Error(idError.message)
        }
        if (passwordError) {
            throw new Error(passwordError.message)
        }

        const authPassword = await comparePasswords(userPassword, password)

        return {
            success: authPassword,
            error: authPassword ? null : 'Las contraseñas no coinciden',
            id
        }
    } catch (error) {
        console.log(error)

        return {
            success: false,
            error: error.message
        }
    }
}

export {
    checkPassword,
    getUserData
}