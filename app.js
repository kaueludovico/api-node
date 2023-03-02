const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const port = 3000

app.use (express.json())

let users = [
  { id: 1, name: 'Usuario Teste', email: 'usuarioTeste@email.com', password: ''}
]

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body

  if (users.some(user => user.email === email)) {
    return res.status(409).send('Usuario ja cadastrado com esse email (impossivel)')
  }

  // Dei uma empolgada e coloquei criptografia na senha <3
  const hashedPassword = await bcrypt.hash(password, 10)


  const id = users.length + 1
  const user = {id, name, email, password: hashedPassword}
  users.push(user);

  res.status(201).json({message: 'Usuario cadastrado com sucesso'})
})

app.post('/login', async (req, res) => {
  const {email, password} = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(401).send('Email ou senha invalidos.');
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return res.status(401).send('Email ou senha invalidos.')
  }

  res.status(200).json({message: 'Logado com sucesso.'})
})

app.listen(port, ()=> {
  //deixei esse console so para desencargo.
  console.log(`Server running on port ${port}`)
})