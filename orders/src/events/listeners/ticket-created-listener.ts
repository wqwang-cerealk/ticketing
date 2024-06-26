import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@wqtickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

//the reason why we need ticket-create-listener here to create a ticket is we want to save
//ticket created in the Ticket service in Order service MongoDB 
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id, 
            title, 
            price
        });
        await ticket.save();
        
        msg.ack();
    }
}