const express = require('express')
const {createConnection} = require('typeorm')
const app = express()
const port = 3000

const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

console.log({ POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD});
console.log(process.env);

const DBconfig = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrations: ['./migrations/*.js'],
};

console.log(DBconfig);

app.get('/api/ping', (req, res) => {
  res.send('Ping!')
});

(async () => {
    try {
        await createConnection(DBconfig);

    } catch (error) {
        console.log('Error while connecting to the database', error);
        // throw error;
    }
})()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});