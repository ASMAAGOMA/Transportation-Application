const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController')

router.post('/notifications', notificationController.createNotification);
router.get('/notifications/:userId', notificationController.getNotification);  
router.put('/notifications/mark-read/:userId', notificationController.updateNotification);  

module.exports = router;
