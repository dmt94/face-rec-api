const express = require('express');
// const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const image = require('./controllers/image');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
// const fetch = require('node-fetch');
const { response } = require('express');

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

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
// app.get('/favicon.ico', (req, res) => {
//   res.send('Favicon?');
// })
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
  profile.handleProfileGet(req, res, db) ;
});
//IMAGE
app.post('/image', (req, res) => {
  image.handleImage(req, res);
});
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is porting on port ${process.env.PORT}`);
});
/*
/            (root)==> res = this is working
/signin            ==> POST, responds with success/fail: any time we are sending password, secure
/register          ==> POST, user
/profile/:userId   ==> GET, user
/image             ==> PUT, user
*/