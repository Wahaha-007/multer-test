const express = require('express');
const router = express.Router();

// Require controller modules.
var file_controller = require('../controllers/fileController');

/* GET users listing. */
router.get('/', file_controller.index);
router.post('/uploadfile', file_controller.uploadSingle);
router.post('/uploadmultiple', file_controller.uploadMultiple);
router.post('/uploadphoto',file_controller.uploadPhoto);

module.exports = router;