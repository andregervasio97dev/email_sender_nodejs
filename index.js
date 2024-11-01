const nodemailer = require('nodemailer');
const express    = require('express');
const app = express();
app.use(express.json());

const appPort = process.env.APP_PORT;

// On final product separate information on another file for security
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

mailOptions = {
    from: process.env.DEFAULT_FROM,
    to: process.env.DEFAULT_TO,
    cc: process.env.DEFAULT_CC,
    bcc: process.env.DEFAULT_BCC,
    subject: process.env.DEFAULT_SUBJECT,
    html: process.env.DEFAULT_HTML
};

// Endpoint for monitoring
app.get('/', (request, response) => {
    console.log('Email sender running normally')
    response.status(200);
    response.json({'status': 'email sender running normally'});
});

app.post('/send_email', (request, response) => {
    console.time("elapsedTimeSendEmail");
    console.log('Received post request');

    // Data check
    try {
        changeMailOptions(request.body);  
    } catch (error) {
        console.log('Error ', error.message);
        // Returns error on JSON response
        response.status(400);
        response.send({'errorMessage': error.message});
        console.timeEnd("elapsedTimeSendEmail");
        return;
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error ', error);
            // Returns error on JSON response
            response.status(500);
            response.send({error});
        } else {
            console.log('Email sent ', info.response);
            // Returns information on JSON response
            response.status(200);
            response.send({info});
        }
    });

    console.log('Finished post request');
    console.timeEnd("elapsedTimeSendEmail");
});

app.listen(appPort, () => {
    console.log(`Email sender open. Listening on port ${appPort} \n`);
});

function changeMailOptions(body) {
    if (Object.keys(body).length === 0) {
        throw new Error('Body invalido');
    }
    // Checks from
    if (body.remetente && body.remetente != "") {
        mailOptions.from = body.remetente;
    }
    // Checks to
    if (body.destinatario && body.destinatario != "") {
        mailOptions.to = body.destinatario;
    }
    // Checks cc
    if (body.copia && body.copia != "") {
        mailOptions.cc = body.copia;
    }
    // Checks bcc
    if (body.bcopia && body.bcopia != "") {
        mailOptions.bcc = body.bcopia;
    }
    // Checks subject
    if (body.assunto && body.assunto != "") {
        mailOptions.subject = body.assunto;
    }
    // Checks html
    if (body.texto && body.texto != "") {
        mailOptions.html = body.texto;
    }        
    // Checks attachments
    if (body.anexos && body.anexos != "") {
        const anexosArray = body.anexos.split(',');

        // Makes attachments an array of maps returned by the lambda function
        const attachments = anexosArray.map((item) => {
            return {
                'path': item
            }
        });
        mailOptions.attachments = attachments;
    }
}