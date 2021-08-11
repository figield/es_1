const test = require('tape');
const card = require('../src/card');

test.only("cannot assign limit for the second time", function (t) {
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