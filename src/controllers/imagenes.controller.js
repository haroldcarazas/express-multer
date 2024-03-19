import path from 'node:path'
import fs from 'node:fs'

export const getImageByFilename = (req, res) => {
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
}

export const uploadImageFn = async (req, res) => {
  res.json({ message: 'Archivo subido correctamente' })
}
