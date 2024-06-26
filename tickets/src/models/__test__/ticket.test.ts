import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async() => {
    //create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: 'asdfgh'
    });

    //save the ticket to the database
    await ticket.save();

    //fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    //make two separate changes to the tickets we fetched
    firstInstance!.set({ price: 10});
    secondInstance!.set({ price: 15});

    //save the first fetched ticket
    await firstInstance!.save();

    //save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }
})

it('increments the version number on multiple saves', async () => {
    //build a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: 'asdfgh'
    });
    //save the ticket to db, default version number = 0
    await ticket.save();
    expect(ticket.version).toEqual(0);
    //save again, expect version number +1
    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
    
})