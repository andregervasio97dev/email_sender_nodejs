module.exports = {
    apps: [
        {
            name: "email_sender_nodejs",
            script: "./src/index.js",
            watch: false,
            env: {
                APP_PORT: 8080,
                USER: "project.1",
                PASS: "secret.1",
                HOST: "localhost",
                SMTP_PORT: 1025,
                DEFAULT_FROM: "teste@teste.com",
                DEFAULT_TO: "teste@teste.com",
                DEFAULT_CC: "teste@teste.com",
                DEFAULT_BCC: "teste@teste.com",
                DEFAULT_SUBJECT: "Assunto Teste",
                DEFAULT_HTML: "<h3>Header 3 Test</h3><h1>Header 1 Test</h1>",
            },
        },
    ],
};
