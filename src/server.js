import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose'; //new
import morgan from 'morgan'; //new
import path from 'path'; //new

import routes from './routes/index.js';

dotenv.config();

// database (it's up to you)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('🌀 connected to MongoDB'));

// database

const app = express();
app.use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true })) //new
  .use(morgan('dev')) //new
  .use('/files', 
    express.static(path.resolve('_dirname', '..', 'tmp', 'uploads'))
  ) //new
  .use(routes);

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`🌀 started server in door: ${port}`);
});