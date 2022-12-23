const express = require('express');
const { createReadStream } = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const USERS = {
  alice: 'alice',
  bob: 'bob',
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.send(`Hello ${username}!`);
  } else {
    createReadStream('index.html').pipe(res);
  }
});

app.post('/login', (req, res) => {
  username = req.body.username;
  password = req.body.password;

  console.log(USERS[username]);
  console.log(password);
  if (password == USERS[username]) {
    res.cookie('username', username);
    res.send('nice!');
  } else {
    res.send('fail!');
  }
});

app.listen(4000);
