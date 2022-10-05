const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  //allow correct recovery from failures, transactions
  //create transaction if you have to do more than one thing
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0].email,
              name: name,
              joined: new Date(),
          })
          .then(user => {
            //knex has built in method called returning()
            res.json(user[0]);
           })
      }).then(trx.commit)
        .catch(trx.rollback)
    }) //end of transaction

  .catch(err => res.status(400).json('Unable to register.'))
}

module.exports = {
  handleRegister: handleRegister
}