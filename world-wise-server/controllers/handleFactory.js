const AppError = require('./../utils/appError');

exports.deleteOne = (model) => async (req, res, next) => {
  try {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No document find with that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.updateOne = (model) => async (req, res, next) => {
  try {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No document find with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.createOne = (model) => async (req, res, next) => {
  try {
    const doc = await model.create(req.body);

    res.status(204).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.getOne = (model, popOption) => async (req, res, next) => {
  try {
    let query = await model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query;

    if (!doc) return next(new AppError('No document find with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.getAll = (model) => async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };

    const docs = await model.find(filter);

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
