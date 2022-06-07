const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Plan = require('../models/plan');
const plans = require('../controllers/plans');

const multer = require('multer');
const upload = multer();

const { isLoggedIn, validatePlan } = require('../middleware');
router.route('/')
    .get(catchAsync(plans.index))
    .post(isLoggedIn, upload.none(),catchAsync(plans.createNewPlan));

router.get('/new', isLoggedIn, plans.renderNewPlan);

router.route('/:id')
    .get(catchAsync(plans.showPlan))
    .put(isLoggedIn, upload.none(), catchAsync(plans.updatePlan))
    .delete(isLoggedIn, catchAsync(plans.deletePlan));

router.get('/:id/edit', isLoggedIn, catchAsync(plans.renderEditPlan));
module.exports = router;