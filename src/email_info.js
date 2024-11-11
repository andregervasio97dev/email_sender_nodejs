const fs = require("fs");

module.exports = class EmailInfo {
    from;
    to;
    cc;
    bcc;
    subject;
    html;
    attachments;
    errorMessages;

    constructor(requestBody) {
        this.from = requestBody.remetente;
        this.to = requestBody.destinatario;
        this.cc = requestBody.copia;
        this.bcc = requestBody.bcopia;
        this.subject = requestBody.assunto;
        this.html = requestBody.texto;
        this.attachments = this.createAttachments(requestBody.anexos);
    }

    createAttachments(requestAttachments) {
        if (requestAttachments != "" && requestAttachments) {
            const anexosArray = requestAttachments.split(",");
            this.errorMessages = "";

            // Makes attachments an array of maps returned by the arrow function
            const attachments = anexosArray.map((item) => {
                let attachment = item.trim();
                try {
                    fs.accessSync(attachment, fs.constants.F_OK);
                    return {
                        path: attachment,
                    };
                } catch (error) {
                    console.error(error.message);
                    this.errorMessages +=
                        "File " + attachment + " not found \n";
                }
            });
            return attachments;
        }
    }
};
