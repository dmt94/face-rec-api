const handleSignIn =  (req, res, db, bcrypt) => {
    db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      //returns array, grab first data
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid){
          //always return so db knows
          return  db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                console.log(user)
                res.json(user[0])
            })
            .catch(err => res.status(400).json('Unable to retrieve user'))
        } else {
            res.status(400).json('invalid credentials!')
        }
        
    })
    .catch(err => res.status(400).json('invalid credentials!'))
}

module.exports = {
    handleSignIn: handleSignIn
}