const test = require('tape');

function now() {
    return new Date('August 19, 2018 23:15:30 UTC');
}

// function now() { return new Date(); }
const {card, recreateFrom} = require('../src/card')(now);

test("cannot assign limit for the second time", function (t) {
    const c = card();

    c.assignLimit(100000);

    t.throws(() => {
        c.assignLimit(15000);
    }, /Cannot assign limit for the second time/);

    t.end();
});
test("can assign limit to a card", function (t) {
    const c = card();

    c.assignLimit(150000);

    t.equal(c.availableLimit(), 150000);

    t.end();
});
test("cannot withdraw when not enough money", function (t) {
    const c = card();
    c.assignLimit(100000);

    t.throws(() => {
        c.withdraw(150000);
    }, /Not enough money/);

    t.end();
});
test("cannot withdraw when no limit assigned", function (t) {
    const c = card();

    t.throws(() => {
        c.withdraw(150000);
    }, /No limit assigned/);

    t.end();
});
test("can withdraw from a card", function (t) {
    const c = card();
    c.assignLimit(150000);

    c.withdraw(100000);

    t.equal(c.availableLimit(), 50000);

    t.end();
});
test("can repay a card", function (t) {
    const c = card();
    c.assignLimit(150000);
    c.withdraw(100000);

    c.repay(50000);

    t.equal(c.availableLimit(), 100000);

    t.end();
});

test("can capture events", function (t) {
    const c = card('1234');
    c.assignLimit(150000);
    c.withdraw(100000);
    c.repay(50000);

    t.deepEqual(c.pendingEvents(), [{
        type: 'LIMIT_ASSIGNED',
        amount: 150000,
        card_id: '1234',
        date: '2018-08-19T23:15:30.000Z'
    }, {
        type: 'CARD_WITHDRAWN',
        amount: 100000,
        card_id: '1234',
        date: '2018-08-19T23:15:30.000Z'
    }, {type: 'CARD_REPAID', amount: 50000, card_id: '1234', date: '2018-08-19T23:15:30.000Z'}]);
    t.end();
});

test("new card gets a new id", function (t) {
    const c = card('1234');

    t.equal(c.uuid(), '1234');

    t.end();
});

test("recreate card from events", function (t) {
    const events = [{
        type: 'LIMIT_ASSIGNED',
        amount: 150000,
        card_id: '12345',
        date: '2018-08-19T23:15:30.000Z'
    }, {
        type: 'CARD_WITHDRAWN',
        amount: 100000,
        card_id: '12345',
        date: '2018-08-19T23:15:30.000Z'
    }, {
        type: 'CARD_REPAID',
        amount: 50000,
        card_id: '12354',
        date: '2018-08-19T23:15:30.000Z'
    }];
    const c = recreateFrom('12345', events);

    t.deepEqual(c.uuid(), '12345');
    t.equal(c.availableLimit(), 100000);
    t.deepEqual(c.pendingEvents(), []);

    t.end();
});

test("can flush events", function (t) {
    const c = card();
    c.assignLimit(150000);
    c.withdraw(100000);
    c.repay(50000);

    c.flushEvents();

    t.deepEqual(c.pendingEvents(), []);

    t.end();
});