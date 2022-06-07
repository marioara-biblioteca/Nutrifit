const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Form = require('../models/form');
const forms = require('../controllers/forms');
const { isLoggedIn } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get( forms.renderForms)
    .post( upload.array('image'), catchAsync(forms.createForm));
router.get('/new', forms.renderNewForm);
router.route('/:id')
    .get(forms.showForm)
    .put(upload.array('image'),catchAsync(forms.editForm));
router.get('/:id/edit', forms.renderEditForm);
module.exports = router;