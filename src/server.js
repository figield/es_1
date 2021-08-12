(async function main() {
    const es = await require('./es')();
    const app = await require('./app')(es);

    app.listen(3000, function () {
        console.log("Listening on port ", 3000);
    });
})();
