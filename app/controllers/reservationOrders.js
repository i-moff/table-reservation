const httpStatus = require('http-status');
const ReservationOrderService = require('./../services/ReservationOrderService');
const ReservationService = require('./../services/ReservationService');

class ReservationOrders {
  /**
   * @param req
   * @param res
   */
  static async createOrder(req, res) {
    const reservation = await ReservationService.getItem(parseInt(req.params.reservationId));
    if (!reservation) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    await ReservationOrderService.create(reservation.id, req.body);

    return res.sendStatus(httpStatus.CREATED);
  }
}

module.exports = ReservationOrders;
