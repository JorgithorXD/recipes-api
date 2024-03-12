import multer from 'multer'

const isLogged = (req, res, next) => {
    try {
        const userId = req.cookies['logged-user-id'] ?? ""

        if (userId == undefined || userId == null || userId == "") {
            console.log('No user logged')
            res.redirect('/user/form/login')
        } else {
            next()
        }
    } catch (error) {
        console.log('Ocurrio un error: ' + error)
    }
}

export {
    isLogged
}