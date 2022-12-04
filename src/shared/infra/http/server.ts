import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import 'express-async-errors';

import axios from "axios";

import '../typeorm';
import routes from './routes';
import handleErrors from './middlewares/handleErrors';
import rateLimiter from './middlewares/rateLimiter';

import '@shared/container';

const app = express();

app.use(rateLimiter);
app.use(express.json());
app.use(routes);

app.use(handleErrors);

app.listen(3333, () => {
  console.log(`🚀 Server started @ 3333`);
});
