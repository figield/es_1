const eventTracker = require("./eventTracker");
const ClientError = require("./clientError");

const LIMIT_ASSIGNED = 'LIMIT_ASSIGNED';
const CARD_WITHDRAWN = 'CARD_WITHDRAWN';
const CARD_REPAID = 'CARD_REPAID';

module.exports = function cardModule(now) {
    function recreateFrom(id, events) {
        return events.reduce((card, event) => {
            card.apply(event);
            return card;
        }, card(id));
    }
    function card(id) {
        let {applyWithRecord, ...tracker} = eventTracker(apply);
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

        function apply(event) {
            if(event.type === LIMIT_ASSIGNED) {
                limit = event.amount;
            }
            if(event.type === CARD_WITHDRAWN) {
                used += event.amount;
            }
            if(event.type === CARD_REPAID) {
                used -= event.amount;
            }
        }


        return {
            ...tracker,
            uuid() {
                return id;
            },
            apply,
            assignLimit(amount) {
                if(limitAlreadyAssigned()) {
                    throw new ClientError('Cannot assign limit for the second time');
                }

                applyWithRecord({type: LIMIT_ASSIGNED, amount, card_id: id, date: now().toJSON()});
            },
            availableLimit,
            withdraw(amount) {
                if(!limitAlreadyAssigned()) {
                    throw new ClientError('No limit assigned');
                }
                if (notEnoughMoney(amount)) {
                    throw new ClientError('Not enough money');
                }

                applyWithRecord({type: CARD_WITHDRAWN, amount, card_id: id, date: now().toJSON()});
            },
            repay(amount) {
                applyWithRecord({type: CARD_REPAID, amount, card_id: id, date: now().toJSON()});
            },
        };
    }
    return {card, recreateFrom};
};