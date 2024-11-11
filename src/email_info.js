module.exports = class EmailInfo {
    from;
    to;
    cc;
    bcc;
    subject;
    html;
    attachments;

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

            // Makes attachments an array of maps returned by the arrow function
            const attachments = anexosArray.map((item) => {
                return {
                    path: item,
                };
            });
            return attachments;
        }
    }
};
