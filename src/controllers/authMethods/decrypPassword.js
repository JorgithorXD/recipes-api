import bcrypt from 'bcrypt'

async function comparePasswords(userPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(userPassword, hashedPassword)
        return match
    } catch (error) {
        console.error('Error al comparar contraseñas:', error)
        throw new Error('Error al comparar contraseñas: ' + error)
    }
}

export {
    comparePasswords
}