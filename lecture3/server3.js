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
    res.send(`Hi ${username}! Your balance is $${BALANCE[username]}
    <form action="/transfer" method="POST">
      Send amount:
      <input type="number" name="amount" />
      To user:
      <input type="text" name="to" />
      <input type="submit" value="Transfer" />
    </form>
    `);
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
    res.cookie('sessionId', sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.redirect('/');
  } else {
    res.send('fail!');
  }
});

app.get('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  delete SESSIONS[sessionId];
  res.clearCookie('sessionId', {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  });
  res.redirect('/');
});

app.post('/transfer', (req, res) => {
  const sessionId = req.cookies.sessionId;
  const username = SESSIONS[sessionId];

  if (!username) {
    res.send('You are not logged in!');
    return;
  }

  const amount = parseInt(req.body.amount);
  const to = req.body.to;

  if (BALANCE[username] < amount) {
    res.send('Not enough money!');
    return;
  }

  BALANCE[username] -= amount;
  BALANCE[to] += amount;

  res.redirect('/');
});

app.listen(4000);
