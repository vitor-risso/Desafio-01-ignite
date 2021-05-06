const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid')

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const checkIfUserExists = users.find(user => user.username === username)

  if (!checkIfUserExists) {
    return response.status(400).json({
      error: 'Mensagem do erro'
    })
  }

  request.user = checkIfUserExists

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  const checkIfUserAlreadyExists = users.find(user => user.username === username)

  if (checkIfUserAlreadyExists) {
    return response.status(400).json({ error: 'Mensagem do erro' })
  }

  const inputUser = {
    id: uuid(),
    name,
    username,
    todos: []
  }

  users.push(inputUser)

  return response.status(201).json(inputUser)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request

  return response.send(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { title, deadline } = request.body
  const { user } = request

  const deadlineToSave = new Date(deadline)

  const todoInput = {
    id: uuid(),
    title,
    done: false,
    deadline: deadlineToSave,
    created_at: new Date()
  }

  user.todos.push(todoInput)

  return response.status(201).json(todoInput)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request
  const { title, deadline } = request.body
  const { id } = request.params

  let todoIndex = user.todos.findIndex(todo => todo.id === id)
  const newDeadline = new Date(deadline)

  if (todoIndex === -1) {
    return response.status(404).json({
      error: 'Mensagem do erro'
    })
  }

  user.todos[todoIndex] = {
    ...user.todos[todoIndex],
    title,
    deadline: newDeadline
  }

  return response.json(user.todos[todoIndex])

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request
  const { id } = request.params

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if(todoIndex == -1){
    return response.status(404).send({	error: 'Mensagem do erro'
  })
  }

  user.todos[todoIndex] = {
    ...user.todos[todoIndex],
    done: true
  }

  return response.json(user.todos[todoIndex])

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request
  const { id } = request.params

  const todoIndex = user.todos.findIndex(todo => todo.id === id)

  if (todoIndex == -1) {
    return response.status(404).json({
      error: 'Mensagem do erro'
    })
  }

  user.todos.splice(todoIndex, 1)

  return response.status(204).json(user.todos)

});

module.exports = app;
