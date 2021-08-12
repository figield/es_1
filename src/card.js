module.exports = function card() {

    let limit;
    let used = 0;
    let events = [];

    // invariant
    function limitAlreadyAssigned() {
        return limit != null;
    }

    function notEnoughMoney(amount) {
        return amount > availableLimit();
    }

    function availableLimit() {
        return limit - used;
    }

    return {
        assignLimit(amount) {
            // business invariant
            if(limitAlreadyAssigned()) {
                throw new Error('Cannot assign limit for the second time');
            }
            events.push({type: 'LIMIT_ASSIGNED', amount});
            limit = amount;
        },
        availableLimit,
        withdraw(amount) {
            if(!limitAlreadyAssigned()) {
                throw new Error('No limit assigned');
            }
            if (notEnoughMoney(amount)) {
                throw new Error('Not enough money');
            }
            events.push({type: 'CARD_WITHDRAWN', amount});
            used += amount;
        },
        repay(amount) {
            events.push({type: 'CARD_REPAID', amount});
            used -= amount;
        },
        pendingEvents() {
            return events;
        },
    };
}