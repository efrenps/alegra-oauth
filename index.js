/* eslint-disable no-console */
/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import Table from 'ascii-table';

import MongooseHelper from './helpers/MongooseHelper.js';
import {
  oauthToken, oauthAuthenticate,
} from './middleware/OAuthMiddleware.js';
import Seeder from './config/Seeder.js';

dotenv.config();
const app = express();
const { DB_SEED, PORT } = process.env;
const port = PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send();
  }); 

app.post('/oauth/token', oauthToken);
app.post('/oauth/token-can', oauthAuthenticate);

// Log Errors
app.use((err, req, res, next) => {
    const { status, message } = err;
    res.status(401).send({ allowed: false, message: status === 503 ? 'Invalid token' : message });
    next(err);
  });
  
  // Error Handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res) => {
    console.error(err.stack);
  });
  
MongooseHelper.startMongoConnection();

if (DB_SEED === 'true') {
  const seeder = new Seeder();
  seeder.insertData().then(() => {
    console.log('Database is ready to go!');
  });
}

app.listen(port, () => {
    const table = new Table('Alegra Oauth2-Server');
    const url = `http://0.0.0.0:${port}`;
    table
      .setHeading(`Server listening on ${url}`)
      .addRow(`POST | ${url}/oauth/token`)
      .addRow(`POST | ${url}/oauth/token-can`);

    console.log(table.toString());
});
