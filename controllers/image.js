const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'd39ba5d8c4f143389356ae5a0bf7991a'
   });

const handleApiCall = (req, res) => {
    app.models
.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
.then(data =>{res.json(data)})
.catch(err => res.status(400).json('error'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
   db('users').where("id", '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries => {
       res.json(entries[0].entries)
   })
   .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage:handleImage,
    handleApiCall: handleApiCall
}