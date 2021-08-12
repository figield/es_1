module.exports = function cardRepositoryFactory(recreateFrom) {
    const storage = new Map();

    return {
        async save(card) {
            const oldEvents = storage.get(card.uuid()) || [];
            const allEvents = [...oldEvents, ...card.pendingEvents()];
            card.flushEvents();
            storage.set(card.uuid(), allEvents);
        },
        async load(uuid) {
            return recreateFrom(uuid, storage.get(uuid) || []);
        }
    };
}