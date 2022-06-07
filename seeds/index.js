const mongoose = require('mongoose');
const Form = require('../models/form');
const Plan = require('../models/plan');
//const faker = require('faker');
const { forms, plans } = require('./seeds');
mongoose.connect('mongodb+srv://cristiana:proiectweb@nutrifit.aw1kj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const seedDB = async () => {
    await Form.deleteMany({});
    for (let i = 0; i < forms.length; i++ ){
        const f = new Form({
            user:forms[i].user,
            weight: forms[i].weight,
            age: forms[i].age,
            gender: forms[i].gender,
            activityLevel: forms[i].activityLevel
        });
        await f.save();
    }  
    await Plan.deleteMany({});
    for (let i = 0; i < plans.length; i++ ){
        const p = new Plan({
            numberOfDays:plans[i].numberOfDays,
            title: plans[i].title,
            description: plans[i].description
        });
        await p.save();
    }  
}

seedDB().then(() => {
    mongoose.connection.close();
})
////trebuie sa rulam in gitbash node seeds/index.js si se vor insera datele