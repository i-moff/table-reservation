const nodemailer = require('nodemailer');

class EmailClient {

  constructor() {
    this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_CLIENT_HOST,
        port: parseInt(process.env.EMAIL_CLIENT_PORT),
        auth: {
          user: process.env.EMAIL_CLIENT_USER,
          pass: process.env.EMAIL_CLIENT_PASSWORD
        },
      }
    );
    console.log({
      host: process.env.EMAIL_CLIENT_HOST,
      port: parseInt(process.env.EMAIL_CLIENT_PORT),
      auth: {
        user: process.env.EMAIL_CLIENT_USER,
        pass: process.env.EMAIL_CLIENT_PASSWORD
      },
    })
  }

  /**
   * @param to
   * @param subject
   * @param message
   * @returns {Promise<*>}
   */
  async sendMail(to, subject, message) {
    let mailOptions = {
      from: 'from@from.com',
      to,
      subject,
      text: message,
      html: `<b>${message}</b>`
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = EmailClient;
