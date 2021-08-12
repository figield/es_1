// aggregate - DDD - business invariants/rules
module.exports = function card() {

    let limit;
    let used = 0;

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
        // command
        assignLimit(amount) {
            // business invariant
            if(limitAlreadyAssigned()) {
                throw new Error('Cannot assign limit for the second time');
            }
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
            used += amount;
        },
        repay(amount) {
            used -= amount;
        }
    };
}