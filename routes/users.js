const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const { isLoggedIn } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/register')
    .get(users.renderRegister)
    .post(upload.array('image'),catchAsync(users.register));
   

router.route('/login') 
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);
router.route('/edit')
    .get(catchAsync(users.renderEditProfile))
    .put(isLoggedIn,upload.array('image'),users.editProfile);
router.route('/profile')
    .get(users.renderProfile);
    //.put(isLoggedIn,upload.none(),users.editProfile);
   
module.exports = router;