const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const image = require('./controllers/image');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: 'a667abf5a45f4481a94c6c0fdbfe1738'
 });

const app = express();
app.use(bodyParser.json())
// app.use(express.urlencoded({extended: false}));
app.use(cors());
// app.use(express.json());

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});
/*
everytime server is restarted, everything is run again
database initiates with the default users prior to the new user added
database is superior bc they run on disk, so that every info is stored efficiently 
*/
app.get('/', (req, res) => {
  res.send('It is working!');
});
//REGISTER -> for REG, SIGN-IN, PROFILE_ID, IMAGE, we are doing dependency injection
app.post('/register', (req, res) => { 
  register.handleRegister(req, res, db, bcrypt);
});
//SIGN-IN
app.post('/signin', (req, res) => {
  signin.handleSignin(db, bcrypt)(req, res);
});
//PROFILE_ID
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});
//IMAGE
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', (req, res) => {
  // image.handleApiCall(req, res)

  clarifai.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => {
    res.json(data)
  }).catch(err => res.status(400).json('unable to grab prediction'))
})

app.listen(process.env.PORT || 4000, () => {
  console.log(`app is porting on port ${process.env.PORT}`);
});
/*
/            (root)==> res = this is working
/signin            ==> POST, responds with success/fail: any time we are sending password, secure
/register          ==> POST, user
/profile/:userId   ==> GET, user
/image             ==> PUT, user
*/