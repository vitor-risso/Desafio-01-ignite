const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid')

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  // Complete aqui
}

app.post('/users', (req, res) => {
  // Complete aqui
  const { name, userName } = req.body

  const checkIfUserAlreadyExists = users.find(user => user.userName === userName)

  if (checkIfUserAlreadyExists) {
    return res.status(400).json({ "msg": "User already existis" })
  }

  const inputUser = {
    id: uuid(),
    name,
    userName,
    todos: []
  }

  users.push(inputUser)

  return res.status(201).json(inputUser)
  
});

app.get('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

module.exports = app;
