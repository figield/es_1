const test = require('tape');
const cardFactory = require('../src/card');
const cardRepository = require('../src/inMemoryCardRepository');
function now() { return new Date('August 19, 2018 23:15:30 UTC'); }
const {card, recreateFrom} = cardFactory(now);

test.skip("should be able to save and load credit card", async function (t) {
    const repository = cardRepository(recreateFrom);
    let c = card('1234');

    c.assignLimit(100);
    c.withdraw(20);
    c.repay(20);

    t.equal(c.pendingEvents().length, 3);
    await repository.save(c);
    t.equal(c.pendingEvents().length, 0);

    c = await repository.load('1234');
    t.equal(c.availableLimit(), 100);

    c.withdraw(100);

    t.equal(c.pendingEvents().length, 1);
    await repository.save(c);
    t.equal(c.pendingEvents().length, 0);

    c = await repository.load('1234');
    t.equal(c.availableLimit(), 0);

    t.end();
});