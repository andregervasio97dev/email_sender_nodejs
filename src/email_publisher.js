const nodemailer = require("nodemailer");

module.exports = class EmailPublisher {
    transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.SMTP_PORT,
        name: process.env.SMTP_NAME,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });

    sendEmail(response, emailInfo) {
        this.transporter.sendMail(emailInfo, function (error, info) {
            if (error) {
                // Returns error on JSON response
                response.status(500);
                console.error({
                    errorMessage: error.message,
                    status: response.statusCode,
                });
                response.send({ errorMessage: error.message });
            } else {
                // Returns information on JSON response
                response.status(200);
                console.log("Email sent ", info.response);
                response.send({ response: info });
            }
        });
    }
};
