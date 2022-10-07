const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: '0afee42ef93a497180797ad4650d128b'
});

const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(resultingData => {res.json(resultingData)})
  .catch(err => res.status(400).json('error grabbing data'))
}

 //updates entries after sending successful request indicating an image is uploaded
 const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries').then(entries => {
    res.json(entries[0].entries)
  }).catch(err => res.status(400).json('Unable to retrieve entries'))
  }


module.exports = {
  handleApiCall: handleApiCall,
  handleImage: handleImage
}



    //CLARIFAI REST API
// const handleApiCall = (req, res) => {
//   const USER_ID = 'buipj1i9q5ps';
//   // Your PAT (Personal Access Token) can be found in the portal under Authentification
//   const PAT = 'e05c24dcc15942f5905ebdaef68d1505';
//   const APP_ID = '7501446225b747c395a14c9c2c2f25a0';
//   // Change these to whatever model and image URL you want to use
//   const MODEL_ID = 'face-detection';
//   const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
//   // const IMAGE_URL = this.state.input; //we need the image input
//   const IMAGE_URL = req.body.input; //we need the image input
//   const raw = JSON.stringify({
//     "user_app_id": {
//         "user_id": USER_ID,
//         "app_id": APP_ID
//     },
//     "inputs": [
//         {
//             "data": {
//                 "image": {
//                     "url": IMAGE_URL
//                 }
//             }
//         }
//     ]
// });
//   const requestOptions = {
//       method: 'POST',
//       headers: {
//           'Accept': 'application/json',
//           'Authorization': 'Key ' + PAT
//       },
//       body: raw
//   };

//   fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
//   .then(data => data.json())
//   .then(resultingData =>  {
//     res.json((resultingData));
//     })
//     .catch(err => 
//     res.status(400).json('Unable to retrieve facial recognition'));
// }//end of handleApiCall