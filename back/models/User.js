const Sequelize = require('sequelize');
const sequelize = require('../lib/db');

const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: "Email invalid" },
            notEmpty: true,
        },
    },
    password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
});

module.exports = User;
