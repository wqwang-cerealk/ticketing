import { Subjects, Publisher, OrderCancelledEvent } from "@wqtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}