import { Router } from 'express'
import { store } from '../controllers/users.controller.js'
import { uploadImage } from '../config/multer.js'

const router = Router()

router.post('/store', uploadImage.single('profilePicture'), store)

export default router
