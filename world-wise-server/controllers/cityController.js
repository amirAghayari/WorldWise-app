const City = require('../models/cityModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllCities = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('User not logged in', 401));
    }

    const user = await User.findById(req.user._id).populate('cities');

    res.status(200).json({
      status: 'success',
      results: user.cities.length,
      data: { cities: user.cities },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getCity = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('User not logged in', 401));
    }

    const user = await User.findById(req.user._id).populate('cities');

    const city = user.cities.find((c) => c._id.toString() === req.params.id);

    if (!city) {
      return next(
        new AppError('No city found with that ID for this user', 404),
      );
    }

    res.status(200).json({
      status: 'success',
      data: { city },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.createCity = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('User not logged in', 401));
    }

    const newCity = await City.create(req.body);

    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { cities: newCity._id } },
      { new: true, runValidators: true },
    );

    res.status(201).json({
      status: 'success',
      data: { city: newCity },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.deleteCity = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('User not logged in', 401));
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { cities: req.params.id } },
      { new: true },
    );

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
