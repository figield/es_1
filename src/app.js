const express = require('express');
const now  = function() { return new Date(); };
const {card, recreateFrom} = require('./card')(now);
const ClientError = require('./clientError');

module.exports = function(es) {
    const app = express();

    const repository = require('./cardRepository')(recreateFrom, es);

    app.use(express.json());

    app.post('/limit', async function(req, res) {
        try {
            // load existing item or create empty card
            const c = await repository.load(req.body.uuid);
            // business logic
            c.assignLimit(req.body.amount);
            // store the card back
            await repository.save(c);
            // command handled, no response - we're in the command part of CQRS
            res.status(204).send();
        } catch (e) {
            if (e instanceof ClientError) {
                // invariant violation
                res.status(400).json({error: e.message});
            } else {
                console.log(e);
                // programmer error
                res.status(500).send();
            }
        }
    });
    app.post('/withdrawal', async function(req, res) {
        try {
            // load existing item or create empty card
            const c = await repository.load(req.body.uuid);
            // business logic
            c.withdraw(req.body.amount);
            // store the card back
            await repository.save(c);
            // command handled, no response - we're in the command part of CQRS
            res.status(204).send();
        } catch (e) {
            if (e instanceof ClientError) {
                // invariant violation
                res.status(400).json({error: e.message});
            } else {
                console.log(e);
                // programmer error
                res.status(500).send();
            }
        }
    });
    app.post('/repayment', async function(req, res) {
        try {
            // load existing item or create empty card
            const c = await repository.load(req.body.uuid);
            // business logic
            c.repay(req.body.amount);
            // store the card back
            await repository.save(c);
            // command handled, no response - we're in the command part of CQRS
            res.status(204).send();
        } catch (e) {
            if (e instanceof ClientError) {
                // invariant violation
                res.status(400).json({error: e.message});
            } else {
                console.log(e);
                // programmer error
                res.status(500).send();
            }
        }
    });
    app.get('/limit/:uuid', async function (req, res) {
        const c = await repository.load(req.params.uuid);
        res.json({uuid: c.uuid(), limit: c.availableLimit()});
    });

    app.close = function() {
        return es.close();
    };

    return app;
};