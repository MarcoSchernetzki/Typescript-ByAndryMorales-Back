import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setCors } from './middlewares/cors.js';
import { errorManager } from './middlewares/errors.js';
import { usersRouter } from './routes/users.js';
import { productRouter } from './routes/products.js';

export const app = express();
app.disable('x-powered-by');
const corsOption = {
    origin: '*',
};

app.use(morgan('dev'));
app.use(cors(corsOption));
app.use(express.json());

app.use(setCors);

app.get('/', (_req, res) => {
    res.send(
        'API Express de la tienda "By Andry Morales", para visualizar los datos de los productos ingrese a este enlace desde la url: "https://marcos-schernetzki-back-final-project.onrender.com/product"'
    ).end();
});

app.use('/user', usersRouter);
app.use('/product', productRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(errorManager);
