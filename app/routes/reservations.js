const express = require('express');
const router = express.Router();
const asyncHandler = require('./../middlewares/async');

const reservationsCtrl = require('../controllers/reservations');

router.route('/reservations').post(asyncHandler(reservationsCtrl.createReservation));

router.route('/reservations/:reservationId')
  .get(asyncHandler(reservationsCtrl.getReservationInfo))
  .put(asyncHandler(reservationsCtrl.updateReservation))
  .delete(asyncHandler(reservationsCtrl.deleteReservation));

module.exports = router;


/**
 * @api {get} api/reservation/:id View Reservation
 * @apiName ViewReservation
 * @apiGroup Reservations
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *    "reservation": {
 *        "id": 1,
 *        "table_id": 1,
 *        "start": "2018-09-21T15:00:00.000Z",
 *        "end": "2018-09-21T18:00:00.000Z",
 *        "guests": 2,
 *        "table": {
 *            "number": 1,
 *            "capacity": 2
 *        }
 *    }
 * }
 */

/**
 * @api {post} api/reservation Create Reservation
 * @apiName CreateReservation
 * @apiGroup Reservations
 *
 * @apiParam {Date} time Time
 * @apiParam {Number} guests Guests
 * @apiParam {Number} duration Duration
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 */

/**
 * @api {put} api/reservation/:id Update Reservation
 * @apiName UpdateReservation
 * @apiGroup Reservations
 *
 * @apiParam {Date} time Time
 * @apiParam {Number} guests Guests
 * @apiParam {Number} duration Duration
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 */

/**
 * @api {delete} api/reservation/:id Delete Reservation
 * @apiName DeleteReservation
 * @apiGroup Reservations
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 NoContent
 */

