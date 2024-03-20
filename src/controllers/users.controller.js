import { pool } from '../config/db.js'
import fs from 'node:fs/promises'

export const store = async (req, res) => {
  try {
    // Extraer los datos enviados desde POST
    const {
      email,
      nombre,
      password,
      fecha_nacimiento: fechaNacimiento
    } = req.body
    const { filename } = req.file

    // Validación de los datos
    if (
      !email?.includes('@') ||
      !nombre ||
      !password ||
      !fechaNacimiento ||
      !filename
    ) {
      return res.status(400).json({ message: 'Faltan datos.' })
    }

    // Ingresar los datos a la db
    const [result] = await pool.execute(
      'INSERT INTO users (email, nombre, password, fecha_nacimiento, imagen) VALUES (?, ?, ?, ?, ?)',
      [email, nombre, password, fechaNacimiento, filename]
    )

    // Validar el id del registro insertado
    if (!result.insertId) {
      return res.status(500).json({ message: 'Error al crear el usuario.' })
    }

    // Traer el usuario insertado
    const [user] = await pool.execute(
      'SELECT email, nombre, imagen FROM users WHERE id = ?',
      [result.insertId]
    )

    // Mensaje al cliente
    res.status(201).json({ message: 'Usuario creado.', user })
  } catch (error) {
    console.log(error)
    let message = 'Error interno'
    let statusCode = 500

    // Validar si el error es por un email duplicado. Si es así, borrar la imagen y cambiar el mensaje y código de error.
    if (error?.errno === 1062) {
      message = 'El email ya existe'
      statusCode = 400
      await fs.unlink(`uploads/${req.file.filename}`)
    }

    res.status(statusCode).json({ message })
  }
}
