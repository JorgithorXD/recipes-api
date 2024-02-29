async function uploadSingleImage(data) {
    try {
        const formData = new FormData()
        formData.append('recipeImage', data)
        console.log(data)

        const url = 'http://localhost:4121/src/post/single-img'
        const opciones = {
            method: 'POST', 
            body: formData
        };
        const respuesta = await fetch(url, opciones);

        if (respuesta.ok) {
            const datosRespuesta = await respuesta.json()
            console.log('Respuesta:', datosRespuesta)
        } else {
            throw new Error('La solicitud fetch falló');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }

}

export {
    uploadSingleImage
}