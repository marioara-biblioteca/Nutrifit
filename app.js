if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');

const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/errors');
const methodOverride = require('method-override');

const Form = require('./models/form');
const User = require('./models/user');
const Plan = require('./models/plan');
//EXPRESS
const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const userRoutes = require('./routes/users');
const planRoutes = require('./routes/plans');
const dayRoutes = require('./routes/days');
const formRoutes = require('./routes/forms');
//MONGOOSE 
const connectDbURL = 'mongodb+srv://cristiana:proiectweb@nutrifit.aw1kj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const localURL = 'mongodb://localhost:27017/nutrifit';
const mongoose = require('mongoose');

const MongoStore = require('connect-mongo');
//salvam sesiunile in baza de date, in tabela sessions
app.use(
  session({
    store: MongoStore.create({ mongoUrl: localURL }),
    secret: 'sessionsecret',
    touchAfter:24*60*60
  })
);
mongoose.connect(localURL, {
//mongoose.connect(connectDbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Mongoose connection open!")
})
.catch(err => {
    console.log("Mongoose error!",err)
})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Oh no, connection error:"));
db.once("open", () => {
    console.log("Database connected!!!");
});





app.use(express.json({  extended: true }));
app.use(express.urlencoded({  extended: true }));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
   
    secret: 'sessionsecret', 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());  




//PASSPORT 
const passport = require('passport');
const LocalStrategy = require('passport-local'); 

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
    
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error');
    
    next();
})
//RUTELE TREBUIE NEPARAT PUSE AICI
app.use('/', userRoutes);
app.use('/plans', planRoutes);
app.use('/days', dayRoutes);
app.use('/forms', formRoutes);

app.get('/', (req, res) => {
    res.render('home'); 
})

app.get('/admin', async (req, res) => {
    const allPlans = await Plan.find();
    const allUsers = await User.find();
    const allForms = await Form.find();
    res.render('user/admin', { allPlans, allUsers,allForms });
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}....`);
})