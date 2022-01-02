const express = require('express');
const { getSwapiSearch, getSwappiById } = require('../controllers/swapi');

const router = express.Router();


router.get('/search', getSwapiSearch);

router.get('/films/:id', (req, res) => getSwappiById(req, res, 'films'));
router.get('/people/:id', (req, res) => getSwappiById(req, res, 'people'));
router.get('/planets/:id', (req, res) => getSwappiById(req, res, 'planets'));
router.get('/species/:id', (req, res) => getSwappiById(req, res, 'species'));
router.get('/starships/:id', (req, res) => getSwappiById(req, res, 'starships'));
router.get('/vehicles/:id', (req, res) => getSwappiById(req, res, 'vehicles'));

module.exports = router;
