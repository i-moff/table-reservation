const amqplib = require('amqplib');

const RESERVATION_REQUEST_QUEUE = 'rrq';
const RESERVATION_REQUEST_NOTIFY_QUEUE = 'rrqn';

class AMQP {

  /**
   * Create amqp connection and return channel.
   * @returns {Promise<*|PromiseLike<T>|Promise<T>>}
   */
  static async send(queue, message) {
    return amqplib.connect(process.env.AMQP_HOST).then(function (conn) {
      return conn.createChannel().then(function (ch) {
        const ok = ch.assertQueue(queue, { durable: false });

        return ok.then(function (_qok) {
          ch.sendToQueue(queue, Buffer.from(message));
          console.log(" [x] Sent '%s'", message);
          return ch.close();
        });
      }).finally(function () {
        conn.close();
      });
    });
  }

  /**
   * @param queue
   * @param onMessageCallback
   * @returns {Promise<*|Promise<T | void>>}
   */
  static async listen(queue, onMessageCallback) {
    amqplib.connect(process.env.AMQP_HOST).then(function (conn) {
      process.once('SIGINT', function () {
        conn.close();
      });

      return conn.createChannel().then(function (ch) {
        let ok = ch.assertQueue(queue, { durable: false });
        ok = ok.then(function (_qok) {
          return ch.consume(queue, function (msg) {
            onMessageCallback(msg);
            console.log(" [x] Received '%s'", msg.content.toString());
          }, { noAck: true });
        });

        return ok.then(function (_consumeOk) {
          console.log(' [*] Waiting for messages.');
        });
      });
    }).catch(console.warn);
  }
}

module.exports = AMQP;
module.exports.RESERVATION_REQUEST_QUEUE = RESERVATION_REQUEST_QUEUE;
module.exports.RESERVATION_REQUEST_NOTIFY_QUEUE = RESERVATION_REQUEST_NOTIFY_QUEUE;



