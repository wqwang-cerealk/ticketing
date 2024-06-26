import { Subjects, Publisher, PaymentCreatedEvent } from "@wqtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}