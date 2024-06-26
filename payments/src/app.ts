import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@wqtickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        //only allow https request for cookie, allow http in test env
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUser);
app.use(createChargeRouter);

//capture error that not found route
app.all('*', async (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app }