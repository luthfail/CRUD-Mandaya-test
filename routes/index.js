const express = require('express')
const router = express.Router()
const Controller = require('../controllers/userController')
const drugRoutes = require('./drugRoutes')

router.post('/register', Controller.register)
router.post('/login', Controller.login)

router.use('/pharmacy', drugRoutes)

module.exports = router