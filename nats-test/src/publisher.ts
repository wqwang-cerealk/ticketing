import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });
    const data = {
        id: '123',
        title: 'concert',
        price: 21
    }

    const publisher = new TicketCreatedPublisher(stan);
    // stan.publish('ticket:created', data, () => {
    //     console.log('Event published!');
    // });

    try {
        await publisher.publish(data);
    } catch (err) {
        console.error(err);
    }

});

//we want to pass some data + channel to NATS Streaming so it can add the event to the list of events
//if a listener is created, it needs to tell stan client that it subsribed to what channel

