const SecurityRouter = require("./security");
const SwapiRouter = require("./swapi");
const verifyToken = require("../middlewars/verifyToken");

const routerManager = (app) => {
    app.use("/", SecurityRouter);
    app.use(verifyToken);
    app.use("/swapi", SwapiRouter);
};

module.exports = routerManager;
