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

//connect server to database
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

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
const app = express();
// app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('It is working!');
})
// app.get('/favicon.ico', (req, res) => {
//   res.send('Favicon?');
// })
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
  profile.handleProfileGet(req, res, db) ;
})
//IMAGE
app.post('/imageurl', (req, res) => {
  // image.handleApiCall(req, res);
  // res.send('received request for imageurl');
  // res.send(req.body);
    const USER_ID = 'buipj1i9q5ps';
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = 'e05c24dcc15942f5905ebdaef68d1505';
    const APP_ID = '7501446225b747c395a14c9c2c2f25a0';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    // const IMAGE_URL = this.state.input; //we need the image input
    const IMAGE_URL = req.body.input; //we need the image input
    console.log(IMAGE_URL);
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
  .then(data => data.json())
  .then(resultingData =>  {
    res.json(resultingData);
    })
    .catch(err => res.status(400).json('Unable to retrieve facial recognition'));
})
app.post('/image', (req, res, db) => {
  // image.handleImage(req, res, db);
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries').then(entries => {
      res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('Unable to retrieve entries'))
})


//update user information, updates entries by increasing count, updates user profile's counter to reflect image uploads
// app.put('/image' , (req, res, db) => {
//   image.handleImage(req, res, db);
// })
// app.post('/imageurl' , (req, res) => {
//   image.handleApiCall(req, res);
//   // res.send('imageurl found');
// })

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