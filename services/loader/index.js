const express = require('express')
const {createConnection} = require('typeorm')
const app = express()
const port = 3000

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
  entities: [],
  logging: true,
  synchronize: false,
  migrationsRun: true,
  migrations: ['./migrations/*.js'],
};

(async () => {
    try {
        await createConnection(DBconfig);
        console.log(`All migrations setuped successfully`)
        
        process.exit(0);
    } catch (error) {
        console.log('Error while connecting to the database', error);
        throw error
    }
})()
