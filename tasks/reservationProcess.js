const AMQP = require('./../app/utils/AMQP');
const ReservationService = require('./../app/services/ReservationService');

require('dotenv').load();

(async () => {

  const createReservation = async (message) => {
    const data = JSON.parse(message.content.toString());

    try {
      await ReservationService.create(data);
      await AMQP.send(AMQP.RESERVATION_REQUEST_NOTIFY_QUEUE, JSON.stringify({ email: data.email, success: true }))
    } catch (e) {
      await AMQP.send(AMQP.RESERVATION_REQUEST_NOTIFY_QUEUE, JSON.stringify({ email: data.email, success: false }))
    }
  };

  await AMQP.listen(AMQP.RESERVATION_REQUEST_QUEUE, (message) => createReservation(message));
})();
