import express from 'express'
import { PORT } from './config/config.js'
import imagenesRouter from './routes/imagenes.routes.js'

const app = express()

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  next()
})

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.use('/api/image', imagenesRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
