import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // if anytime a client is shutted 
    stan.on('close', () => {
        console.log("NATS connection closed!");
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
})

//handler watch for any single time when the client is being shut down
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());




