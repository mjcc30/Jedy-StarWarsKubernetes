const express = require("express");
const cors = require('cors');

const sequelize = require('./lib/db');

const app = express();
app.use(express.json());
app.use(cors());


const RouterManager = require("./routes");
RouterManager(app);

sequelize.sync().then(() => console.log('connected to DB'))
app.listen(process.env.PORT || 4000), () => console.log("listening on port 4000");
