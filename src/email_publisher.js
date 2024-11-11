const nodemailer = require("nodemailer");

module.exports = class EmailPublisher {
    transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    });

    sendEmail(response, emailInfo) {
        this.transporter.sendMail(emailInfo, function (error, info) {
            if (error) {
                console.error("Error ", error.message);
                // Returns error on JSON response
                response.status(500);
                response.send({ errorMessage: error.message });
            } else {
                console.log("Email sent ", info.response);
                // Returns information on JSON response
                response.status(200);
                response.send({ response: info });
            }
        });
    }
};
