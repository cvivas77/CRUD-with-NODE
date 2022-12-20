const express = require('express');
const path = require('path');
const fs = require('fs/promises');


const app = express();
app.use(express.json());

const jsonPath = path.resolve('./file/tasks.json')

app.get('/tasks', async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, 'utf8');

  res.send(jsonFile);
});

app.post('/tasks', async(req, res) => {
  const tasks = req.body;
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1;
  tasksArray.push({...tasks, id: newId});
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end();
});

app.put('/tasks', async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
  const {status, id} = req.body;
  const tasksIndex = tasksArray.findIndex(tasks => tasks.id === id);
  if(tasksIndex >= 0) {
    tasksArray[tasksIndex].status = status;
  }
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.send();
});

app.delete('/tasks', async (req, res) => {
  const tasksArray = JSON.parse(await fs.readFile(jsonPath));
  const {id} = req.body;
  const tasksIndex = tasksArray.findIndex(tasks => tasks.id === id);
  tasksArray.splice(tasksIndex, 1);
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end();
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});