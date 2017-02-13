import { ENUM, CHAR } from "sequelize";
import orm from "../helpers/orm";
import crypto from "crypto";


export default orm.define(
    "authMechanism",
    {
        type: {
            type: ENUM("BASIC"),
            allowNull: false,
            default: "BASIC"
        },
        salt: {
            type: CHAR(24),
            allowNull: false
        },
        hash: {
            type: CHAR(88),
            allowNull: false
        },
        sessionId: CHAR(88)
    },
    {
        instanceMethods: {
            correctPassword: function(password) {
                return match(this.salt, this.hash, password);
            },
            setPassword: function(password) {
                const sh = saltHashPassword(password);
                this.salt = sh.salt.toString("base64");
                this.hash = sh.hash.toString("base64");
            }
        }
    }
);


function sha512(salt, password) {
    const hash = crypto
        .createHmac("sha512", salt)
        .update(password)
        .digest("base64");
    return { salt, hash};
}

function saltHashPassword(password) {
    if (password == null) throw "null password";
    return sha512(
        crypto.randomBytes(16).toString("base64"),
        password
    );
}

function match(salt, hash, password) {
    if (salt == null || hash == null || password == null)
        return false;
    const hash2 = sha512(salt, password).hash;
    let same = 1;
    for (let i = 0; i < hash2.length; i++) {
        same = same & (hash[i] === hash2[i]);
    }
    return same === 1;
}
