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
  const { username } = req.headers

  const checkIfUserExists = users.find(user => user.userName === username)

  if (!checkIfUserExists) {
    return res.status(400).json({ "msg": "User does not exists" })
  }

  req.user = checkIfUserExists

  return next()
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

  const { user } = req

  return res.send(user.todos)

});

app.post('/todos', checksExistsUserAccount, (req, res) => {
  // Complete aqui

  const { title, deadline } = req.body
  const { user } = req

  const deadlineToSave = new Date(deadline + " 00:00")

  const todoInput = {
    id: uuid(),
    title,
    done: false,
    deadline: deadlineToSave,
    created_at: new Date()
  }

  user.todos.push(todoInput)

  return res.status(201).json(user.todos)
});

app.put('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui

  const { user } = req
  const { title, deadline } = req.body
  const { id } = req.params

  let todoIndex = user.todos.findIndex(todo => todo.id === id)
  const newDeadline = new Date(deadline + " 00:00")

  if (todoIndex === -1) {
    return res.status(400).json({ "msg": "Todo not found" })
  }

  user.todos[todoIndex] = {
    ...user.todos[todoIndex],
    title,
    deadline: newDeadline
  }

  return res.json(user.todos)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (req, res) => {
  // Complete aqui

  const { user } = req
  const { id } = req.params

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  user.todos[todoIndex] = {
    ...user.todos[todoIndex],
    done: true
  }

  return res.json(user.todos)

});

app.delete('/todos/:id', checksExistsUserAccount, (req, res) => {
  // Complete aqui

  const {user} = req
  const {id} = req.params

  const todoIndex = user.todos.findIndex(todo => todo.id ===id)  

  if(todoIndex == -1){
    return res.status(400).json({"msg": "Todo not found"})
  }

  user.todos.splice(todoIndex, 1)

  return res.json(user.todos)

});

module.exports = app;
