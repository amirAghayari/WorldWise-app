const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Allow requests from the Vite dev server and enable credentials so cookies can be set
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

// parse cookies sent by the client
app.use(cookieParser());

app.use(express.json({ limit: '30kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'welcome to worldWise server api',
  });
});

app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
