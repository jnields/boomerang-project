import { QueryTypes } from "sequelize";
import crypto from "crypto";
import orm from "./orm";
import {
    User,
    AuthMechanism
} from "../models";
import logServerError from "./log-server-error";

export default function(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return verifySessionId(req,res, next);
    }

    const parsed = Buffer.from(authHeader.slice(6), "base64").toString();
    const ix = parsed.indexOf(":"),
        username = parsed.slice(0, ix),
        password = parsed.slice(ix + 1);
    User.findOne({
        where: { username },
        include: [
            { model: AuthMechanism }
        ]
    }).then(result => {
        if (result == null
                || result.authMechanism == null
                || !result.authMechanism.correctPassword(password)){
            return send422();
        }

        req.user = result;

        if (result.authMechanism.sessionId == null) {
            const sessionId = crypto.randomBytes(16).toString("base64");
            return result
                .authMechanism
                .update({ sessionId })
                .then(() => success(result));
        }
        return success(result);
    }).catch(logServerError.bind(null, req, res));

    function send422() {
        res.status(422).send({ error: "invalid format" });
    }

    function success(user) {
        res.cookie(
            "SID",
            user.authMechanism.sessionId,
            {
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true
            }
        );
        return getUserSchool(user)
            .then(school => {
                req.school = school;
                next();
            });
    }
}

function verifySessionId(req, res, next) {
    const sessionId = req.cookies.SID;
    if (sessionId && sessionId.length) {
        return User.findOne({
            include: [{
                model: AuthMechanism,
                where: { sessionId }
            }]
        })
        .then(result => {
            req.user = result;
            return getUserSchool(result);
        })
        .then(school => {
            req.school = school;
            return next();
        })
        .catch(logServerError.bind(null, req, res));
    } else {
        req.user = null;
        req.school = null;
        return next();
    }
}

function getUserSchool(user) {
    if (user == null) return null;
    return orm.query(
        `
        select school.id, school.name
        from schools school
        left join students student
        on student.schoolid = school.id
        left join users suser
        on student.id = suser.studentid
        left join teachers teacher
        on teacher.schoolid = school.id
        left join users tuser
        on tuser.teacherid = teacher.id
        where (
            tuser.id = ${user.id}
            or suser.id = ${user.id}
        )
        limit 1;
        `,
        { queryType: QueryTypes.SELECT }
    ).then(
        results => {
            return results[0].length
                ? results[0][0]
                : null;
        }
    );
}
