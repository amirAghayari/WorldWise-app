const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const uploadController = require('../controllers/uploadController');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router
  .post('/signup', authController.signup)
  .post('/login', authController.login)
  .post('/forgotPassword', authController.forgotPassword)
  .patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updateMyPassword', authController.updatePassword);
router.post(
  '/uploadImage',
  uploadController.uploadImage,
  uploadController.handleImageUpload,
);
router.post('/upgrade', paymentController.fakeUpgrade);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
