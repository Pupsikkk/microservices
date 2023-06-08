const express = require('express')
const {createConnection, EntitySchema} = require('typeorm');

const app = express()
const port = 3000

let connection;

class User {
  constructor(id, firstName, lastName, email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

const userSchema = new EntitySchema({
  tableName: 'users',
  name: 'User',
  target: User,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    firstName: {
      type: 'varchar',
    },
    lastName: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
      unique: true,
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
  entities: [userSchema],
  logging: true,
  synchronize: false,
  migrationsRun: false,
};


app.get('/api/users', async (req, res) => {
  const userRepository = connection.getRepository(User);
  const users = await userRepository.find();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const userRepository = connection.getRepository(User);
  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  await userRepository.save(user);
  res.json(user);
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const userRepository = connection.getRepository(User);
  const user = await userRepository.findOne({ where: {id}});
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  await userRepository.save(user);
  res.json(user);
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const userRepository = connection.getRepository(User);
  const user = await userRepository.findOne({ where: {id}});
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await userRepository.remove(user);
  res.sendStatus(204);
});

createConnection(DBconfig).then((conn) => {
  connection = conn;

  app.listen(port, () => {
    console.log('Server is running on port 3000');
  });
});