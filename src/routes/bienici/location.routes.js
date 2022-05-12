const express = require('express');
const { getAllAchat } = require('../../controllers/bienici/achat.controller');
const { getAllLocation } = require('../../controllers/bienici/location.controllers');
const routes = express.Router();

routes.get('/location', getAllLocation)
routes.get('/achat', getAllAchat)

module.exports = routes;