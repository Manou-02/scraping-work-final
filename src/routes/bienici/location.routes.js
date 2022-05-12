const express = require('express');
const { getAllLocation } = require('../../controllers/bienici/location.controllers');
const { getLocations } = require('../../controllers/bienici/location2.controller');
const routes = express.Router();

routes.get('/location', getAllLocation)
routes.get('/locations', getLocations);

module.exports = routes;