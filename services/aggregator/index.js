const { default: axios } = require('axios');
const express = require('express')
const { Kafka } = require('kafkajs');

const app = express()
const port = 3000

const kafka = new Kafka({
    brokers: ['kafka:9092'],
});
const producer = kafka.producer();

app.get('/api/aggregate', async (req, res) => {
    await producer.send({
        topic: 'stats',
        messages: [{
            value: JSON.stringify({
                microservice: 'aggregator'
            })
        }],
    });
    await producer.send({
        topic: 'log',
        messages: [{ value: `AGGREGATOR - [DELETE /api/aggregate] ${new Date()}` }],
    });
   try {
   const users = await axios.get('http://local-users:3001/api/users');
   console.log({ users: users.data })
   const cities = await axios.get('http://local-cities:3001/api/cities');
   console.log({ cities: cities.data })

  res.json({users: users.data, cities: cities.data});
   } catch (err) {
    console.log(err.data)
    res.json(err.data)
   }
});

app.listen(port, async () => {
    await producer.connect();
    console.log('Server is running on port 3000');
});
