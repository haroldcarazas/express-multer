import express from 'express'
import { PORT } from './config.js'
import multer from 'multer'

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
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  }
})

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

// Función para manejar el error
const handleError = (err, req, res, next) => {
  console.log(err)
  res.status(400).json({ error: 'Solo se admiten imágenes' })
}

// Ruta para subir archivos y manejar el error de cuando no es una imagen
app.post('/upload', upload.single('imagen'), handleError, async (req, res) => {
  res.json({ message: 'Archivo subido correctamente' })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
