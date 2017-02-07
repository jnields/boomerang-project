import {
    STRING,
    DATEONLY,
    ENUM,
    INTEGER,
    CHAR
} from "sequelize";
import orm from "../helpers/orm";
import crypto from "crypto";

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

export default orm.define(
    "user",
    {
        firstName: STRING,
        lastName: STRING,
        email: STRING,
        dob: DATEONLY,
        gender: ENUM("M","F"),
        age: INTEGER,
        salt: CHAR(24),
        hash: CHAR(88),
        sessionId: CHAR(24),
        tier: ENUM("1","2","3")
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
