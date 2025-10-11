const City = require('../models/cityModel');
const AppError = require('../utils/appError');

exports.getAllCities = async (req, res, next) => {
  try {
    const cities = await City.find();
    res.status(200).json({
      status: 'success',
      results: cities.length,
      data: {
        cities,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return next(new AppError('No city found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        city,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.createCity = async (req, res, next) => {
  try {
    const newCity = await City.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        city: newCity,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.deleteCity = async (req, res, next) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return next(new AppError('No city found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};
