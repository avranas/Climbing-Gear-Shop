const express = require('express');
const app = express();
const PORT = 3000 // || something goes here

app.get('/', (req, res) => {
  res.status(200).send('Hello world');
});

app.listen(PORT, ()=> {
  console.log('Now listening on Port: ' + PORT);
})