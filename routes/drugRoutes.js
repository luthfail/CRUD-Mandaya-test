const express = require('express')
const router = express.Router()
const Controller = require('../controllers/drugController')
const auth = require('../middleware/authentication')

router.get('/', Controller.getAllDrugs)
router.post('/', auth, Controller.createDrug)
router.get('/shopping-cart', auth, Controller.getShoppingCart)
router.post('/payment', auth, Controller.payment)
router.get('/:id', Controller.getDrug)
router.post('/:id/buy', auth, Controller.buyDrug)

router.patch('/:id', auth, Controller.restockDrug)
router.delete('/:id', auth, Controller.deleteDrug)

module.exports = router