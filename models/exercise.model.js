const mongoose = require('mongoose');

ExerciseSchema = mongoose.Schema({
    date : Date,
    duration : Number,
    description : String,
    userId : mongoose.Schema.ObjectId
});

const ExerciseModel = mongoose.model('Exercise', ExerciseSchema);

module.exports = ExerciseModel;