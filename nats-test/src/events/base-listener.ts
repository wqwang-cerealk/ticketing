import nats, { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    private client: Stan; //an already successfully connected client
    //number of the seconds this listener has to ack a message
    protected ackWait = 5 * 1000; //protected so subclasses can redefine if wanted

    //constructor for client
    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable() //at the very first time the listener is online, get all events emitted before
        .setManualAckMode(true) //after certain processing, the event will be acknowledged
        .setAckWait(this.ackWait) //customize ack time for a listener
        .setDurableName(this.queueGroupName) //save all events (whether processed or not processed) detail
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
    }
}