const handleProfile = (req, res, db) => {
    const { id } = req.params;
   
    db.select('*').from('users')
    .where({id})
    .then(user => {
       if(user.length) {
        res.json(user)
       } else {
           res.status(400).json('User not found :(')
       }
        
    })
    .catch(err => err.status(400).json('Error retrieving user'))
  
}

module.exports = {
    handleProfile: handleProfile
}