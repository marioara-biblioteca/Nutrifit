const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PlanSchema = new Schema({
    title: { type: String, required: true },
    numberOfDays: Number,
    description: String
});

module.exports = mongoose.model("Plan", PlanSchema);
