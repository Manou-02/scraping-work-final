const express = require('express');
const { getAllAchat } = require('../../controllers/bienici/achat.controller');
const { getAllLocation } = require('../../controllers/bienici/location.controllers');
const { getAllNeuf } = require('../../controllers/bienici/neuf.controller');
const routes = express.Router();

routes.get('/location', getAllLocation)
routes.get('/achat', getAllAchat)
routes.get('/neuf', getAllNeuf);

module.exports = routes;