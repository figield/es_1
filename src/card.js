module.exports = function card(card_id) {

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
        uuid() {
            return card_id;
        },
        assignLimit(amount) {
            // business invariant
            if(limitAlreadyAssigned()) {
                throw new Error('Cannot assign limit for the second time');
            }
            events.push({type: 'LIMIT_ASSIGNED', amount, card_id});
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
            events.push({type: 'CARD_WITHDRAWN', amount, card_id});
            used += amount;
        },
        repay(amount) {
            events.push({type: 'CARD_REPAID', amount, card_id});
            used -= amount;
        },
        pendingEvents() {
            return events;
        },
    };
}