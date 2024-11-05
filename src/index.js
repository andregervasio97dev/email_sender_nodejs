import express, { json } from 'express';
import { EmailInfo } from './email_info.js';
import { EmailPublisher } from './email_publisher.js';
const app = express();
app.use(json());
const appPort = process.env.APP_PORT;


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
    validateBody(request.body);

    const emailInfo = new EmailInfo(request.body);
    new EmailPublisher().sendEmail(response, emailInfo);

    console.log('Finished post request');
    console.timeEnd("elapsedTimeSendEmail");
});

app.listen(appPort, () => {
    console.log(`Email sender open. Listening on port ${appPort} \n`);
});

function validateBody(body) {
        // Data check
        try {
            mandatoryFieldsValidator(body);  
        } catch (error) {
            console.log('Error ', error.message);
            // Returns error on JSON response
            response.status(400);
            response.send({'errorMessage': error.message});
            console.timeEnd("elapsedTimeSendEmail");
            return;
        }
}

function mandatoryFieldsValidator(body) {
    if (Object.keys(body).length < 4) {
        throw new Error('Body invalido');
    }
    if (body.destinatario === '') {
        throw new Error('Destinatario invalido');
    }
    if (body.remetente === '') {
        throw new Error('Remetente invalido');
    }
    if (body.assunto === '') {
        throw new Error('Assunto invalido');
    }
    if (body.texto === '') {
        throw new Error('texto invalido');
    }
}