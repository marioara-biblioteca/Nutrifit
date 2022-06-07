
const Forms = require('../models/form');
const Days = require('../models/day');
const User = require('../models/user');
module.exports.renderForms = async (req, res) => {
    const currentUser = res.locals.currentUser;
    const start = await Forms.findById(currentUser.startParameters);
    const current = await Forms.findById(currentUser.currentParameters);
  
    if (current && start) {
        const days = await Days.find({}).where('user').equals(currentUser._id);
        if (days.length > 0) {
            
            //facem calcule
            var results = [];
            var result = days.map(day => day.tvTime).reduce((acc, amount) => acc + amount);
            results.push(result);
            var result = days.map(day => day.workTime).reduce((acc, amount) => acc + amount);
            results.push(result);
            var result = days.map(day => day.totalCaloriesEaten).reduce((acc, amount) => acc + amount);
            results.push(result);
            var result = days.map(day => day.totalCaloriesBurned).reduce((acc, amount) => acc + amount);
            results.push(result);
    
            for (let i = 0; i < results.length; i++) {
                results[i] = results[i] / results.length;
            }
        
            res.render('forms/index', { currentUser, start, current, results });
        } else {
            res.render('days/new');
        }
    } else {
        res.render('forms/new');
    }
}
module.exports.showForm = async (req, res) => {
    const form = await Forms.findById(req.params.id);
    res.render('forms/show', { form });
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const form = await Forms.findById(id)
    if (!form) {
        req.flash('error', 'Cannot find that form!');
        return res.redirect('/forms');
    }
    res.render('forms/edit', { form });

}
module.exports.editForm = async (req, res) => {
   
    const { id } = req.params;
    var activity = req.body.activity;
    console.log(req.body);
    const form = await Forms.findByIdAndUpdate(id, { ...req.body.form });
    if (activity)
    {
        
        form.activityLevel = activity[0]; //checkbox selection
    }

    if (req.files)
    {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));   
        form.progressPic = imgs[0];
    }
   
    await form.save();
    req.flash('success', 'Successfully updated form!');
    res.redirect(`/forms/${form._id}`)

}
module.exports.renderNewForm =  (req, res) => {    
    res.render('forms/new');
}

module.exports.createForm = async (req, res, next) => {
  
    
    const forms = await Forms.find({ user: res.locals.currentUser.id });
    
    if (forms.length == 0)
    {
        const user = await User.findById(res.locals.currentUser._id );
        const current = new Forms(req.body.form);
        const start=new Forms(req.body.form);
       
        const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
       
        current.progressPic = images[0];
        current.user = res.locals.currentUser._id;
        await current.save();
        
        start.progressPic = images[0];
        start.user = res.locals.currentUser._id;
        await start.save();
        
        user.currentParameters = current;
        user.startParameters = start;
        await user.save();
        res.redirect(`/forms/${current._id}`)    
    } else 
    {
        
        req.flash('error', 'Just edit your current form');
    }
   
}
