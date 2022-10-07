const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const image = require('./controllers/image')
const profile = require('./controllers/profile')

const app = express();
app.use(bodyParser.json())
app.use(cors())
const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  });

app.get('/', (req, res) => {
    res.send('Successfully connected to the server')
})
app.post('/register', (req, res) => { 
    register.handleRegister(req, res, db, bcrypt)
})

app.post('/signin',(req, res) => {
    signin.handleSignIn(req,res,db,bcrypt)
})

app.get('/profile/:id', (req, res) => {
    profile.handleProfile(req, res, db)
})

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res)
})

app.put('/image', (req, res) => {
    image.handleImage(req, res, db)
})


app.listen(process.env.PORT || 4000, () => {
    console.log(`App is running on ${process.env.PORT}`)
})




