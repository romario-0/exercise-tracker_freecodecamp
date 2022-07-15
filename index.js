const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

const Database = require('./dbconfig');
app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const UserModel = require('./models/user.model');
const ExerciseModel = require('./models/exercise.model');

app.post('/api/users', async function(req, res, next) {
  const username = req.body.username;
  if(username){
    const user = await UserModel.findOne({ username : username});
    if(!user){
      const newUserModel = new UserModel({
        username : username
      });
      newUserModel.save(function(err, user){
        res.send({username : user.username, _id : user._id});
      });
    }else{
      res.send({username : user.username, _id : user._id});
    }
  }else{
    res.send('Invalid username')
  }
});

app.get('/api/users', function(req, res, next){
  UserModel.find({},'-__v',function(err, userList){
    res.send(userList);
  })
})

function dateIsValid(date) {
  return date instanceof Date && !isNaN(date);
}

app.post('/api/users/:_id/exercises', function(req, res, next) {
  const userId = req.params._id;
  UserModel.findById(userId, function(err, user){
    if(user){
      let date = req.body.date ? new Date(req.body.date) : new Date();
      const newExerciseModel = new ExerciseModel({
        date : date,
        duration : req.body.duration,
        description : req.body.description,
        userId : user._id
      });
      newExerciseModel.save(function(err, exercise){
        res.send({ _id : user._id, username : user.username, date : exercise.date.toDateString(),
          duration : exercise.duration,
          description : exercise.description});
      });  
    }
  })
});

app.get('/api/users/:_id/logs', async function(req, res, next){
  const userId = req.params._id;
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
  const user = await UserModel.findById(userId);
    if(user){
      const exercises = await ExerciseModel.find({ userId : userId});
    const count = exercises.length;
    const limit = req.query.limit ? req.query.limit : count;
    const filteredLogs = exercises.filter(ele => {
      let month = `0${ele.date.getMonth()+1}`.slice(-2);
      let day = `0${ele.date.getDate()}`.slice(-2);
      
      const compareDate = new Date(`${ele.date.getFullYear()}-${month}-${day}`);

      if(!(from && compareDate < from)){
        if(!(to && compareDate > to)){
          return true;
        }
      }
    }).map( ele => {
      return { description : ele.description, duration : ele.duration, date : ele.date.toDateString() };
    }).slice(0, limit);
    res.send({ username : user.username, count : filteredLogs.length, _id : user._id, log : filteredLogs })
  }else{
    res.send('User not found');
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
