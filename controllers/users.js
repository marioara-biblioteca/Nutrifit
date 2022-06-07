const User = require('../models/user');
const Plan = require('../models/plan');
const Form = require('../models/form');
const Days = require('../models/day');

module.exports.renderRegister = (req, res) => {
    res.render('user/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const possibleUser = new User({ email, username });
        possibleUser.images= req.files.map(f => ({ url: f.path, filname: f.filname }));
        const registeredUser = await User.register(possibleUser, password); //metoda din passport local mongoose
        
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Nutrifit!');
            res.redirect('/profile');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('user/login');
}

module.exports.login = async (req, res, next) => {
    const { email, username, password } = req.body;
    if (username == 'admin') {
        res.redirect('/admin');
    } else {
       // req.flash('success', 'Long time no see!');
        const redirectUrl = req.session.returnTo || '/profile';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("See you back soon!");
    res.redirect('/');
} 

module.exports.renderProfile = (req, res) => {
    const currentUser = res.locals.currentUser;
    res.render('user/profile',{currentUser});
}
module.exports.renderEditProfile = async (req, res) => {
    const plans = await Plan.find();
    const currentUser = res.locals.currentUser;
    res.render('user/edit', { plans, currentUser });
}
module.exports.editProfile = async (req, res) => {

    const currentUser = res.locals.currentUser;
    const { username, password } = { ...req.body.user };
    const user = await User.findByIdAndUpdate(currentUser._id, {"username": username,"password": password });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    user.images.push(...imgs);
    await user.save();

    res.redirect(`profile`);
}
