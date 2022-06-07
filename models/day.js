const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DaySchema = new Schema({
    user: {type:Schema.Types.ObjectId, ref:'User'},
    timestamp: { type:Number, required: true,default:Date.now()},
    totalCaloriesEaten: Number,
    totalCaloriesBurned: Number,
    tvTime: Number,
    workTime:Number
});

module.exports = mongoose.model("Day", DaySchema);
