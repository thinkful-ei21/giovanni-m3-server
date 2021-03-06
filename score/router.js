'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('../users/models');

const router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
  let username = req.user.username;
  console.log(req.user.username);
  User.find({username})
    .then(usr => {
      console.log(usr[0].highScore);
      return usr[0].highScore;
    })
    .then(score =>res.status(201).json({ data: score}));
});

router.post('/', jsonParser, (req, res) => {
  let username = req.user.username;
  
  console.log(req.user.username, req.headers.score);

  User.find({username})
    .then(usr => {
      console.log(usr[0].highScore);
      return usr[0].highScore;
    })
    .then(score =>{
      if(score < req.headers.score){
        return User.findOneAndUpdate({username},{highScore: req.headers.score});
      }
      else {return score;}
    })
    .then(()=> User.find({username})) 
    .then(found => {
      console.log(found[0].highScore);
      return found[0].highScore;
    })

    .then(score =>res.status(201).json({ data: score}));

});
// router.post

// // Post to register a new user
// router.post('/', jsonParser, (req, res) => {
//   const requiredFields = ['username', 'password'];
//   const missingField = requiredFields.find(field => !(field in req.body));

//   console.log(req.body);
//   if (missingField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Missing field',
//       location: missingField
//     });
//   }

//   const stringFields = ['username', 'password'];
//   const nonStringField = stringFields.find(
//     field => field in req.body && typeof req.body[field] !== 'string'
//   );

//   if (nonStringField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Incorrect field type: expected string',
//       location: nonStringField
//     });
//   }

//   const explicityTrimmedFields = ['username', 'password'];
//   const nonTrimmedField = explicityTrimmedFields.find(
//     field => req.body[field].trim() !== req.body[field]
//   );

//   if (nonTrimmedField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: 'Cannot start or end with whitespace',
//       location: nonTrimmedField
//     });
//   }

//   const sizedFields = {
//     username: { min: 3 },
//     password: { min: 10, max: 72 }
//   };

//   const tooSmallField = Object.keys(sizedFields).find(
//     field =>
//       'min' in sizedFields[field] &&
//             req.body[field].trim().length < sizedFields[field].min
//   );
//   const tooLargeField = Object.keys(sizedFields).find(
//     field =>
//       'max' in sizedFields[field] &&
//             req.body[field].trim().length > sizedFields[field].max
//   );

//   if (tooSmallField || tooLargeField) {
//     return res.status(422).json({
//       code: 422,
//       reason: 'ValidationError',
//       message: tooSmallField
//         ? `Must be at least ${sizedFields[tooSmallField]
//           .min} characters long`
//         : `Must be at most ${sizedFields[tooLargeField]
//           .max} characters long`,
//       location: tooSmallField || tooLargeField
//     });
//   }

//   let {username, password} = req.body;


//   return User.find({username})
//     .count()
//     .then(count => {
//       if (count > 0) {
//         // There is an existing user with the same username
//         return Promise.reject({
//           code: 422,
//           reason: 'ValidationError',
//           message: 'Username already taken',
//           location: 'username'
//         });
//       }
//       return User.hashPassword(password);
//     })
//     .then(hash => {
//       return User.create({
//         username,
//         password: hash,
//       });
//     })
//     .then(user => {
//       return res.status(201).json(user.username);
//     })
//     .catch(err => {
//       if (err.reason === 'ValidationError') {
//         return res.status(err.code).json(err);
//       }
//       res.status(500).json({code: 500, message: 'Internal server error!'});
//     });
// });

module.exports = {router};
