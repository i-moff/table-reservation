const OrdersApiServiceProxy = require('./../services/proxies/OrdersApiServiceProxy');
const db = require('./../../db');

const TABLE_ORDERS = 'orders';

class ReservationOrdersService {
  /**
   * @param {Number} reservationId
   * @param {{}} orderData
   * @returns {Promise<void>}
   */
  static async create(reservationId, orderData) {
    const order = await OrdersApiServiceProxy.create(orderData);

    return db(TABLE_ORDERS).returning('id').insert({ reservation_id: reservationId, uri: order.headers.location });
  }
}

module.exports = ReservationOrdersService;
