import { Publisher, TicketUpdatedEvent, Subjects } from "@wqtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}