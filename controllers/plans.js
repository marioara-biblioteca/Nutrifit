const User = require('../models/user');
const Plan = require('../models/plan');
var ObjectId = require('mongodb').ObjectId; 

//app.get('/plans', async (req, res) => {
module.exports.index = async (req, res) => {
    const plans = await Plan.find();
    res.render('plans/index', {plans});
}

module.exports.renderNewPlan = (req, res) => {
    res.render('plans/new');
}

//app.get('/plans/:id', async (req, res) => {
module.exports.showPlan = async (req, res) => {
    const currentUser = res.locals.currentUser;
    const plan = await Plan.findById(req.params.id);
    const userPlan = await Plan.findById(currentUser.currentPlan);
   
    res.render('plans/show', { plan,userPlan ,currentUser});
};

//app.get('/plans/:id/edit', async (req, res) => {
module.exports.renderEditPlan = async (req, res) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
        req.flash('error', 'Cannot find that plan!');
        return res.redirect('/plans');
    }

    res.render('plans/edit', { plan });
}
module.exports.createNewPlan = async (req, res) => {
    if (req.user.username == 'admin') {
        const plan = new Plan(req.body.plan);
        await plan.save();
       
        req.flash("Successfully made a new plan!");
        res.redirect(`/plans/${plan._id}`);
    }else{
        req.flash('error', 'Permission denied!');
        return res.redirect('/login');
    }
}

//app.put('/plans/:id', async (req, res) => {
module.exports.updatePlan = async (req, res) => {
    
    if ( req.user.username == 'admin') {
       const plan = await Plan.findByIdAndUpdate(req.params.id, { ...req.body.plan });
       await plan.save();
       req.flash('success', 'Successfully updated plan');
       res.redirect(`/plans/${plan._id}`);
   }else{
        req.flash('error', 'Permission denied!');
        return res.redirect('/plans');
   }
}
module.exports.deletePlan = async (req, res) => {
    if (req.user.username == 'admin') {
        const { id } = req.params;
        const deletedPlan = await Plan.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted plan');
        res.redirect('/plans');
    } else {
        req.flash('error', 'Permission denied to delete plan!');
    }
}