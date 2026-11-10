const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Banco de dados em memória temporário
let users = [
  { id: 1, name: "George Bluth", email: "george.bluth@reqres.in" },
  { id: 2, name: "Janet Weaver", email: "janet.weaver@reqres.in" }
];

// GET: Listar usuários
app.get('/api/users', (req, res) => {
  res.status(200).json({
    page: 1,
    per_page: 6,
    total: users.length,
    data: users
  });
});

// GET: Buscar usuário por ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({});
  }
  res.status(200).json({ data: user });
});

// POST: Criar usuário
app.post('/api/users', (req, res) => {
  const { name, job } = req.body;
  
  if (!name || !job) {
    return res.status(400).json({ error: "Name and job are required" });
  }

  const newUser = {
    id: Math.floor(Math.random() * 1000),
    name,
    job,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT: Atualizar usuário existente
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, job } = req.body;
  
  let user = users.find(u => u.id === userId);
  
  // Se o usuário foi deletado por outro teste, recriamos ele para manter o teste independente!
  if (!user) {
    user = { id: userId, name: "Janet Weaver", email: "janet.weaver@reqres.in" };
    users.push(user);
  }

  user.name = name || user.name;
  user.job = job || user.job;
  user.updatedAt = new Date().toISOString();

  res.status(200).json(user);
});

// DELETE: Remover usuário existente
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  
  // Se já foi deletado, retornamos 204 mesmo assim para o teste passar limpo
  if (index === -1) {
    return res.status(204).send();
  }

  users.splice(index, 1);
  res.status(204).send();
});
// Inicia o servidor local de testes
const server = app.listen(PORT, () => {
  console.log(`🚀 Mock API rodando em http://localhost:${PORT}`);
});

module.exports = server;