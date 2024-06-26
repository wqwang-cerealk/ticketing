import { OrderCreatedListner } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@wqtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    //create an instance of listener
    const listener = new OrderCreatedListner(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 129,
        userId: 'asdf'
    });
    await ticket.save();

    //create the fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'qwert',
        expiresAt: '2999-01-01',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    //fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg};
}

it('sets the order userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
    
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();
    
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket upadted event', async() => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    //
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);
});


