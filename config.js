"use strict";
if (process.env.NODE_ENV === "production") {
    module.exports = {
        "proxyPort": null,
        "port": 8080,
        "db": {
            "database": "boomerang",
            "username": "boomerang",
            "password": "MXM-YJl-iOh-BDW"
        },
        "certFile": "/etc/letsencrypt/live/nields.io/fullchain.pem",
        "keyFile": "/etc/letsencrypt/live/nields.iop/privkey.pem"
    };
} else {
    module.exports = {
        "proxyPort": 35412,
        "port": 3000,
        "db": {
            "database": "boomerang",
            "username": "root",
            "password": "MXM-YJl-iOh-BDW"
        },
        "certFile": null,
        "keyFile": null
    };
}
