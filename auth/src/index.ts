import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    //check to make sure env variables are defined
    if (!process.env.JWT_KEY) {
        throw new Error("Env JWT_KEY must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("Env MONGO_URI must be defined");
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Auth MongoDB!');
    } catch (err) {
        console.log(err);
    }
    
    app.listen(3000, () => {
        console.log('Listening on port 3000!!!');
    });
}

start();

