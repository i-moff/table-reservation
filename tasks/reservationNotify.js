const AMQP = require('./../app/utils/AMQP');
const EmailClient = require('./../app/utils/EmailClient');
require('dotenv').load();

(async () => {
  try {
    const emailClient = new EmailClient();
    const processReservationStatus = async (message) => {
      const data = JSON.parse(message.content.toString());
      await emailClient.sendMail(
        data.email,
        'Reservation Status',
        data.success ? 'Reservation is confirmed.' : 'Reservation is not confirmed'
      );
    };

    await AMQP.listen(AMQP.RESERVATION_REQUEST_NOTIFY_QUEUE, (message) => processReservationStatus(message))
  } catch (e) {
    // TODO: write to logs
    console.log(`Error occurred ${e.message}!`)
  }
})();
