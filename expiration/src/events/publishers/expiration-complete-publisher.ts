import { ExpirationCompleteEvent, Subjects, Publisher } from "@wqtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}