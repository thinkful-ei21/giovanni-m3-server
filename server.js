'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const cors = require('cors');


const { PORT, CLIENT_ORIGIN, DATABASE_URL } = require('./config');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: scoreRouter} = require('./score');



const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({ origin: CLIENT_ORIGIN })
);


passport.use(localStrategy);
passport.use(jwtStrategy);


//unprotected endpoints go here
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

//protected endpoints go here

app.use('/api/score/', jwtAuth, scoreRouter);
// app.get('/api/score', jwtAuth, (req, res) => {
//   return res.json({
//     data: 'rosebud'
//   });
// });

// app.post('/api/score', jwtAuth, (req, res) => {
//   return res.json({
//     data: 'rosebud'
//   });
// });

app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});
  
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});


let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}
  
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
  
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}
  
module.exports = { app, runServer, closeServer };