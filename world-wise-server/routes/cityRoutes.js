const express = require('express');
const cityController = require('../controllers/cityController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(cityController.getAllCities)
  .post(cityController.createCity);

router
  .route('/:id')
  .get(cityController.getCity)
  .delete(cityController.deleteCity);

module.exports = router;
