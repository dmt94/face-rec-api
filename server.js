const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//connect server to database
const db = knex({
  //we are using postgreSQL aka "pg"
  client: 'pg',
  connection: {
    host : '127.0.0.1', //home, localhose
    port : 5432,
    user : 'mariestayl',
    password : '',
    database : 'face-rec-db'
  }
});
//query statement, the knex builder made query request
db.select('*')
  .from('users').then(data => {
    // console.log(data);
  });

/*
everytime server is restarted, everything is run again
database initiates with the default users prior to the new user added
database is superior bc they run on disk, so that every info is stored efficiently 
*/
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('It is working!');
})

app.get('/favicon.ico', (req, res) => {
  res.send('testing icon');
})

//REGISTER -> for REG, SIGN-IN, PROFILE_ID, IMAGE, we are doing dependency injection
app.post('/register', (req, res) => { 
  register.handleRegister(req, res, db, bcrypt);
})
//SIGN-IN
app.post('/signin', (req, res) => {
  signin.handleSignin(db, bcrypt)(req, res);
})
//PROFILE_ID
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db) 
})
//IMAGE
//update user information, updates entries by increasing count, updates user profile's counter to reflect image uploads
app.put('/image' , (req, res) => {
  image.handleImage(req, res, db)
})

app.post('/imageurl' , (req, res) => {
  image.handleApiCall(req, res)
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
})
/*
/            (root)==> res = this is working
/signin            ==> POST, responds with success/fail: any time we are sending password, secure
/register          ==> POST, user
/profile/:userId   ==> GET, user
/image             ==> PUT, user
*/