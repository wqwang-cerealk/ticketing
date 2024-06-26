import { Listener, OrderCreatedEvent, Subjects } from "@wqtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListner extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        //find associated the ticket and lock the ticket 
        
        //fetch the ticket of this order
        const ticket = await Ticket.findById(data.ticket.id);
        //if no ticket, throw error
        if (!ticket) {
            throw new Error('Ticket Not Found!');
        }

        //otherwise, add orderId to the orderId property to mark the ticket reserved
        ticket.set({ orderId: data.id});
        //save the ticket
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });

        //ack the msg
        msg.ack();
    }
}