const express = require('express')
const router = express.Router()
const Controller = require('../controllers/userController')
const drugRoutes = require('./drugRoutes')
const auth = require('../middleware/authentication')

router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.patch('/top-up', auth, Controller.topUp)

router.use('/pharmacy', drugRoutes)

module.exports = router