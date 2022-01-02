const express = require("express");
const securityController = require('../controllers/security');
const router = express.Router();

router.post("/login", securityController.login);
router.post("/users", securityController.createUser);

module.exports = router;
