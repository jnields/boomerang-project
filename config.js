"use strict";

const certFile = process.env.CERT_FILE,
    keyFile = process.env.KEY_FILE,
    database = process.env.BOOMERANG_DATABASE,
    username = process.env.BOOMERANG_USER,
    password = process.env.BOOMERANG_PASSWORD,
    port = process.env.PORT || 3000,
    proxyPort = 35412;

module.exports = {
    proxyPort,
    port,
    db: {
        database,
        username,
        password
    },
    certFile,
    keyFile
};
