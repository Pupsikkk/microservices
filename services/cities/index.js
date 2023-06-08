const express = require('express');
const {createConnection, EntitySchema} = require('typeorm');

const app = express();
app.use(express.json());
const port = 3000;

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


app.get('/api/cities', async (req, res) => {
  const cityRepository = connection.getRepository(City);
  const cities = await cityRepository.find();
  res.json(cities);
});

app.post('/api/cities', async (req, res) => {
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
  console.log({ id, cityName, region, country });
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

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});