exports.fakeUpgrade = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'your account successfully upqraded',
  });
};

// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ['card'],
// success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
//   req.params.tourId
// }&user=${req.user.id}&price=${tour.price}`,
//   success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
//   cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
//   customer_email: req.user.email,
//   client_reference_id: req.params.tourId,
//   line_items: [
//     {
//       name: `${tour.name} Tour`,
//       description: tour.summary,
//       images: [
//         `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
//       ],
//       amount: tour.price * 100,
//       currency: 'usd',
//       quantity: 1
//     }
//   ]
// });
