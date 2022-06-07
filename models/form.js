const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const opts = { toJSON: { virtuals: true } };


const FormSchema = new Schema({
    user: {type:Schema.Types.ObjectId, ref:'User'},
    weight: Number,
    height: Number,
    age: Number,
    date: Date,
    progressPic:ImageSchema,
    activityLevel: { type: String, enum : ['Beginner','Medium','Advanced','Expert' ],default : 'Beginner'},
    gender: { type: String, enum : ['Male','Female'],default:'Female'}
});

module.exports = mongoose.model("Form",FormSchema);
