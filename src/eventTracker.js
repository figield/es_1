function eventTracker(apply) {
    let events = [];

    return {
        applyWithRecord(event) {
            events.push(event);
            return apply(event);
        },
        pendingEvents() {
            return events;
        },
        flushEvents() {
            events = [];
        }
    };
}

module.exports = eventTracker;