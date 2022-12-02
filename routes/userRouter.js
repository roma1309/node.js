const express = require('express');
const userController = require('../controllers/userController');
const controller = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

router.get('/',authMiddleware, controller.getPrincipal)
router.delete('/delete',authMiddleware, controller.deleteUser)
router.put('/update',authMiddleware, controller.updateUser)
router.post('/create/pdf',userController.createPDF)

module.exports = router;