const express = require('express');
const { getAllAchat } = require('../../controllers/bienici/achat.controller');
const { getAllDetailsLocation } = require('../../controllers/bienici/locations.controller');
const { getAllNeuf } = require('../../controllers/bienici/neuf.controller');
const { getAllTerrain } = require('../../controllers/bienici/terrain.controllers');
const routes = express.Router();


routes.get('/locations', getAllDetailsLocation);
routes.get('/achat', getAllAchat);
routes.get('/neuf', getAllNeuf);
routes.get('/terrain', getAllTerrain);

module.exports = routes;