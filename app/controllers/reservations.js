const httpStatus = require('http-status');
const ReservationService = require('./../services/ReservationService');

class Reservations {

  /**
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  static async getReservationInfo(req, res) {
    return res.json({ reservation: await Reservations.getReservationOrSendNotFound(res, req.params.reservationId) });
  };

  /**
   * @param req
   * @param res
   */
  static async createReservation(req, res) {
    const reservationId = await ReservationService.create(req.body);

    res.status(httpStatus.CREATED)
      .location(`/reservations/${reservationId}`)
      .send();
  }

  /**
   * @param req
   * @param res
   */
  static async updateReservation(req, res) {
    const reservation = await Reservations.getReservationOrSendNotFound(res, req.params.reservationId);
    await ReservationService.update(reservation.id, req.body);

    res.sendStatus(httpStatus.OK);
  }

  /**
   * @param req
   * @param res
   */
  static async deleteReservation(req, res) {
    const reservation = await Reservations.getReservationOrSendNotFound(res, req.params.reservationId);
    await ReservationService.remove(reservation.id);

    res.sendStatus(httpStatus.NO_CONTENT);
  }

  /**
   * @param res
   * @param {Number} id
   * @returns {Promise<void>}
   */
  static async getReservationOrSendNotFound(res, id) {
    const reservation = await ReservationService.getItem(id);
    if (!reservation) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return reservation;
  }
}

module.exports = Reservations;
