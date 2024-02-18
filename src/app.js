import express from "express"
import recipesRoutes from "./routes/recipesRoutes.js"
import userRoutes from './routes/userRoutes.js'

const app = express()
const PORT = 4121

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.use('/recipe', recipesRoutes)
app.use('/user', userRoutes)

app.listen(PORT, () => {
    console.log('server listening on https://localhost:' + PORT)
})