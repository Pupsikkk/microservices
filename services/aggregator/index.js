const { default: axios } = require('axios');
const express = require('express')

const app = express()
const port = 3000

app.get('/api/aggregate', async (req, res) => {
   const users = await axios.get('http://local-users:3001/api/users');
   console.log({ users: users.data })
   const cities = await axios.get('http://local-cities:3001/api/cities');
   console.log({ cities: cities.data })

  res.json({users: users.data, cities: cities.data});
});

app.listen(port, () => {
    console.log('Server is running on port 3000');
});
