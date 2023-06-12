const { default: axios } = require('axios');
const express = require('express')

const app = express()
const port = 3000

app.get('/api/aggregate', async (req, res) => {
   const users = await axios.get('http://localhost/api/users');
   const cities = await axios.get('http://localhost/api/users');

  res.json({users, cities});
});

app.listen(port, () => {
    console.log('Server is running on port 3000');
});
