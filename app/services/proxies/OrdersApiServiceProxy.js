const axios = require('axios');

class OrdersApiServiceProxy {
  /**
   * @param {Object} data
   */
  static async create(data) {
    return axios.post(
      `${process.env.ORDERS_API_SERVICE_URL}orders`,
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

module.exports = OrdersApiServiceProxy;
