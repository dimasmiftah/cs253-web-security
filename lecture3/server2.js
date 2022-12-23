const express = require('express');
const { createReadStream } = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { randomBytes } = require('crypto');

const USERS = {
  alice: 'alice',
  bob: 'bob',
};

const BALANCE = {
  alice: 200,
  bob: 100,
};

const SESSIONS = {}; // { sessionId: username }

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  const sessionId = req.cookies.sessionId;
  const username = SESSIONS[sessionId];
  if (username) {
    res.send(`Hi ${username}! Your balance is ${BALANCE[username]}`);
  } else {
    createReadStream('index.html').pipe(res);
  }
});

app.post('/login', (req, res) => {
  username = req.body.username;
  password = req.body.password;

  if (password == USERS[username]) {
    const sessionId = randomBytes(16).toString('hex');
    SESSIONS[sessionId] = username;
    res.cookie('sessionId', sessionId);
    res.redirect('/');
  } else {
    res.send('fail!');
  }
});

app.get('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete SESSIONS[sessionId];
  res.clearCookie('sessionId');
  res.redirect('/');
});

app.listen(4000);
