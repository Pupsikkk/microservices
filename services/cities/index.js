const express = require('express');
const {createConnection, EntitySchema} = require('typeorm');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

const kafka = new Kafka({
  brokers: ['kafka:9092'],
});
const producer = kafka.producer();

const port = 3000;
let isBroken = false;

let connection;

class City {
  constructor(id, cityName, region, country) {
    this.id = id;
    this.cityName = cityName;
    this.region = region;
    this.country = country;
  }
}

const citySchema = new EntitySchema({
  tableName: 'cities',
  name: 'City',
  target: City,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    cityName: {
      type: 'varchar',
    },
    region: {
      type: 'varchar',
    },
    country: {
      type: 'varchar',
    },
  },
});

const MYSQL_DATABASE = process.env.MYSQL_DATABASE
const MYSQL_USER = process.env.MYSQL_USER
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD

const DBconfig = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  entities: [citySchema],
  logging: true,
  synchronize: false,
  migrationsRun: false,
};

app.get('/api/cities/untested-request', async (req, res) => {
  await producer.send({
    topic: 'stats',
    messages: [{
      value: JSON.stringify({
        microservice: 'cities'
      })
    }],
  });
  await producer.send({
    topic: 'log',
    messages: [{ value: `CITIES - [GET /api/cities/untested-request] ${new Date()}` }],
  });
  isBroken = !isBroken;

  res.send(isBroken);
})

app.get('/api/cities', async (req, res) => {
  await producer.send({
    topic: 'stats',
    messages: [{
      value: JSON.stringify({
        microservice: 'cities'
      })
    }],
  });
  await producer.send({
    topic: 'log',
    messages: [{ value: `CITIES - [GET /api/cities] ${new Date()}` }],
  });
  const cityRepository = connection.getRepository(City);
  const cities = await cityRepository.find();

  if (isBroken) {
    setTimeout(() => {res.json(cities)}, 10000)
  } else {
    res.json(cities);
  }
});

app.post('/api/cities', async (req, res) => {
  await producer.send({
    topic: 'stats',
    messages: [{
      value: JSON.stringify({
        microservice: 'cities'
      })
    }],
  });
  await producer.send({
    topic: 'stats',
    messages: [{
      value: {
        microservice: 'cities'
      }
    }],
  });
  await producer.send({
    topic: 'log',
    messages: [{ value: `CITIES - [POST /api/cities] ${new Date()}: \n    BODY${JSON.stringify(req.body)}` }],
  });
  const { cityName, region, country } = req.body;
  const cityRepository = connection.getRepository(City);
  const city = new City();
  city.cityName = cityName;
  city.region = region;
  city.country = country;
  await cityRepository.save(city);
  res.json(city);
});

app.put('/api/cities/:id', async (req, res) => {
  await producer.send({
    topic: 'stats',
    messages: [{
      value: JSON.stringify({
        microservice: 'cities'
      })
    }],
  });
  await producer.send({
    topic: 'log',
    messages: [{ value: `CITIES - [PUT /api/cities/:id] ${new Date()}: \n    BODY${JSON.stringify(req.body)}\n    PARAMS:${JSON.stringify(req.params)}` }],
  });
  const { id } = req.params;
  const { cityName, region, country } = req.body;
  const cityRepository = connection.getRepository(City);
  const city = await cityRepository.findOne({ where: {id}});
  if (!city) {
    return res.status(404).json({ message: 'City not found' });
  }
  city.cityName = cityName;
  city.region = region;
  city.country = country;
  await cityRepository.save(city);
  res.json(city);
});

app.delete('/api/cities/:id', async (req, res) => {
  await producer.send({
    topic: 'stats',
    messages: [{
      value: JSON.stringify({
        microservice: 'cities'
      })
    }],
  });
  await producer.send({
    topic: 'log',
    messages: [{ value: `CITIES - [DELETE /api/cities/:id] ${new Date()}: \n    PARAMS:${JSON.stringify(req.params)}` }],
  });
  const { id } = req.params;
  const cityRepository = connection.getRepository(City);
  const city = await cityRepository.findOne({ where: {id}});
  if (!city) {
    return res.status(404).json({ message: 'User not found' });
  }
  await cityRepository.remove(city);
  res.sendStatus(204);
});

createConnection(DBconfig).then((conn) => {
  connection = conn;

  app.listen(port, async () => {
    await producer.connect();
    console.log('Server is running on port 3000');
  });
});