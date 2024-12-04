const express = require("express");
const EmailInfo = require("./email_info.js");
const EmailPublisher = require("./email_publisher.js");
const app = express();
app.use(express.json());

const appPort = process.env.APP_PORT;

// Endpoint for monitoring
app.get("/", (_request, response) => {
    response.status(200);

    console.log({
        message: "Email sender running normally",
        status: response.statusCode,
    });

    response.json({ status: "email sender running normally" });
});

app.post("/send_email", (request, response) => {
    console.time("elapsedTimeSendEmail");

    // Data check
    emailSend(request.body, response);

    console.timeEnd("elapsedTimeSendEmail");
});

app.listen(appPort, () => {
    console.log(`Email sender open. Listening on port ${appPort} \n`);
});

function emailSend(body, response) {
    // Data check
    try {
        mandatoryFieldsValidator(body);

        const emailInfo = new EmailInfo(body);
        if (emailInfo.errorMessages == "") {
            return new EmailPublisher().sendEmail(response, emailInfo);
        }

        response.status(500);
        console.error({
            errorMessage: emailInfo.errorMessages,
            status: response.statusCode,
        });

        response.send({ errorMessages: emailInfo.errorMessages });
    } catch (error) {
        // Returns error on JSON response
        response.status(400);
        console.error({
            errorMessage: error.message,
            status: response.statusCode,
        });

        response.send({ errorMessage: error.message });
        return;
    }
}

function mandatoryFieldsValidator(body) {
    if (Object.keys(body).length < 4) {
        throw new Error("Body invalido");
    }
    if (body.destinatario === "") {
        throw new Error("Destinatario invalido");
    }
    if (body.remetente === "") {
        throw new Error("Remetente invalido");
    }
    if (body.assunto === "") {
        throw new Error("Assunto invalido");
    }
    if (body.texto === "") {
        throw new Error("texto invalido");
    }
}
