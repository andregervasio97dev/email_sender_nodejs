const express = require("express");
const EmailInfo = require("./email_info.js");
const EmailPublisher = require("./email_publisher.js");
const app = express();
app.use(express.json());

const appPort = process.env.APP_PORT;

// Endpoint for monitoring
app.get("/", (_request, response) => {
    console.log("Email sender running normally");
    response.status(200);
    response.json({ status: "email sender running normally" });
});

app.post("/send_email", (request, response) => {
    console.time("elapsedTimeSendEmail");
    console.log("Received post request");

    // Data check
    emailSend(request.body, response);

    console.log("Finished post request");
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

        console.error({ errorMessages: emailInfo.errorMessages });
        response.status(500);
        response.send({ errorMessages: emailInfo.errorMessages });
    } catch (error) {
        console.error("Error ", error.message);
        // Returns error on JSON response
        response.status(400);
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
