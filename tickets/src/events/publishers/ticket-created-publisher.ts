import { Publisher, TicketCreatedEvent, Subjects } from "@wqtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}