const User = require('../models/user');
const Day = require('../models/day');

module.exports.index = async (req, res) => {
    const days = await Day.find();
    res.render('days/index', {days});
}

module.exports.renderNewDay = (req, res) => {
    res.render('days/new');
}
module.exports.createNewDay = async (req, res) => {

   
    const { totalCaloriesEaten, totalCaloriesBurned, workTime,tvTime } = { ...req.body.day };
    const day = new Day({
        user: res.locals.currentUser._id,
        timestamp:Date.now(),
        totalCaloriesEaten: totalCaloriesEaten,
        totalCaloriesBurned: totalCaloriesBurned,
        workTime: workTime,
        tvTime: tvTime
    });
   
    await day.save();
    req.flash("Successfully recorded your input!");
    res.redirect('/days');
}
