require('dotenv').config();

import express, { json } from 'express';
import { connect, connection } from 'mongoose';
const mongoString = process.env.DATABASE_URL;

connect(mongoString);
const database = connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})
const app = express();

app.use(json());

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})