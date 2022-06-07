const express = require('express');
const router = express.Router();
const Day = require('../models/day');
const days = require('../controllers/days');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const upload = multer();

router.route('/')
    .get(days.index)
  
router.route('/new')
    .get(days.renderNewDay)
    .post(upload.none(), catchAsync(days.createNewDay));

module.exports = router;