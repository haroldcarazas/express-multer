import express from 'express'
import { PORT } from './config.js'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'

const app = express()

// Configurar el almacenamiento de archivos en el servidor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

// Configurar la carga de archivos
const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  }
})

// Función para manejar el error
const handleError = (err, req, res, next) => {
  console.log(err)
  res.status(400).json({ error: 'Solo se admiten imágenes' })
}

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  next()
})

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

// Ruta para mostrar una imagen
app.get('/image/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const absolutePath = path.resolve(`./uploads/${filename}`)

    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).json({ message: 'Imagen no encontrada' })
      } else {
        res.sendFile(absolutePath)
      }
    })
  } catch (error) {
    res.json({ message: error.message })
  }
})

// Ruta para subir archivos y manejar el error de cuando no es una imagen
app.post('/upload', uploadImage.single('imagen'), handleError, async (req, res) => {
  res.json({ message: 'Archivo subido correctamente' })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
