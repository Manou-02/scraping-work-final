const express = require('express');
const { getAllLocation } = require('../../controllers/bienici/location.controllers');
const routes = express.Router();

routes.get('/location', getAllLocation)

module.exports = routes;