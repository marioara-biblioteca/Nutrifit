const { array } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    type: { type: String, enum: ['admin', 'guest', 'basic'], default: 'guest', required: true },
    currentPlan: {  type: Schema.Types.ObjectId, ref: 'Plan' },
    plans: [{ type: Schema.Types.ObjectId, ref: 'Plan' }, {type:Date}],
    startParameters: { type: Schema.Types.ObjectId, ref:'Form' },
    currentParameters: { type: Schema.Types.ObjectId, ref: 'Form' },
    images:[ImageSchema]
   
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);