import orm from "../helpers/orm";
import {
    Student,
    School,
    StudentSchool,
    User,
    Teacher,
    TeacherSchool
} from "../models";
import crypto from "crypto";
import config from "../../../config";
import { Router } from "express";

const router = Router();

export default orm.sync().then(initializeRoutes).then(() => router);

function verifyAuthentication(req, res, next) {
    const sessionId = req.cookies.SESSION_ID || "";
    if (sessionId.length) {
        User.findOne({ where: { sessionId } }).then(
            result => {
                if (result) {
                    req.user = result;
                    return next();
                } else {
                    return send403();
                }
            },
            logServerError.bind(null, res)
        );
    } else {
        send403();
    }
    function send403() {
        res.status(403).send({error: "unauthenticated"});
    }
}

function initializeRoutes() {
    router.head("/", authorize);

    router.route("/schools")
    .all(verifyAuthentication, tier(1))
    .get((req,res) => {
        const limit = Math.min(req.params.$pageSize || 10, 1000),
            offset = limit * (req.params.$page || 0);
        School.findAll({
            where: { },
            limit,
            offset
        }).then(
            schools => {
                res.send(schools);
            },
            logServerError.bind(null, res)
        );
    })
    .post((req, res) => {
        const school = req.body;
        if (school.id) {
            return res.status(422)
                .send({"error": "explicit value provided for id"});
        } else {
            School.create(school).then(
                saved => {
                    return res
                        .set("Location", `/schools/${saved.id}`)
                        .status(201)
                        .send(school);
                },
                logServerError.bind(null, res)
            );
        }
    })
    .delete((req, res) => {
        const id = req.params.school_id;
        if (id == null)
            return res.status(400).send({"error": "no id specified to delete"});
        School.destroy({ where: {id}, limit: 1 }).then(
            number => {
                if (number) {
                    return res.status(204).end();
                } else {
                    return res.status(404).end();
                }
            },
            logServerError.bind(null, res)
        );
    });

    router.route("/schools/:school_id")
    .all(verifyAuthentication, tier(2), sameSchool)
    .get((req,res) => {
        School.findOne({id: req.params.school_id}).then(
            school => {
                if (school) {
                    res.send(school);
                } else {
                    res.status(404).send({error: "not found"});
                }
            },
            logServerError.bind(null, res)
        );
    })
    .put((req, res) => {
        const school = req.body;
        if ((school && (school.id == req.params.school_id)) == null) {
            return res.status(400).send({"error": "ID mismatch"});
        }
        School.update(
            school,
            {
                where: { id: school.id },
                limit: 1
            }
        ).then(
            arr => {
                const count = arr[0], rows = arr[1];
                if (count == 0) {
                    return req.status(404).send({"error": "not found"});
                } else {
                    return req.status(200).send(rows[0]);
                }
            },
            logServerError.bind(null, res)
        );
    });

    router.route("/schools/:school_id/teachers")
    .all(verifyAuthentication, tier(2), sameSchool)
    .get((req,res) => {
        const limit = Math.min(req.params.$pageSize || 10, 1000),
            offset = limit * (req.params.$page || 0);
        Teacher.findAll({
            where: { },
            limit,
            offset,
            include: [{
                model: School,
                where: { id: req.params.school_id }
            }]
        }).then(
            teachers => {
                res.send(teachers);
            },
            logServerError.bind(null, res)
        );
    })
    .post((req, res) => {
        const schoolId = req.params.shool_id,
            teacherId = req.params.teacher_id,
            teacher = req.body;
        if (schoolId == null
                || teacherId != null
                || teacher == null
                || teacher.id != null) {
            return res.stats(400).send({"error": "bad request"});
        }
        Teacher.create(teacher).then(
            saved => {
                if (teacher) {
                    res.set("Location", `/schools/${schoolId}/teachers/${teacherId}`)
                        .status(201)
                        .send(saved);
                } else {
                    res.status(500).send({error: "server error"});
                }
            },
            logServerError.bind(null, res)
        );
    });

    router.route("/schools/:school_id/students")
    .all(verifyAuthentication, tier(2), sameSchool)
    .get((req,res) => {
        const limit = Math.min(req.params.$pageSize || 10, 1000),
            offset = limit * (req.params.$page || 0);
        Student.findAll({
            where: { },
            include: [{
                model: School,
                where: { id: req.parms.school_id }
            }],
            limit,
            offset
        }).then(
            res.send,
            logServerError.bind(null, res)
        );
    })
    .post((req,res) => {

    });

    router.route("/schools/:school_id/teachers/:teacher_id")
    .all(verifyAuthentication, tier(2), sameSchool)
    .get((req, res) => {
        Teacher.findOne({
            where: { id: req.params.teacher_id },
            include: [{
                model: School,
                where: {
                    id: req.params.school_id
                }
            }]
        }).then(
            teacher => {
                return teacher
                    ? res.send(teacher)
                    : res.status(404).send({"error": "not found"});
            },
            logServerError.bind(null, res)
        );
    })
    .put((req, res) => {
        const teacher = req.body;
        const schoolId = req.params.schoolId,
            teacherId = req.params.teacherId;

        if (teacher.id !== undefined && teacherId != teacher.id) {
            return res.status(400).send({"error": "id mismatch"});
        }

        delete teacher.id;

        Teacher.update(
            teacher,
            {
                where: { id: teacherId },
                limit: 1,
                include: [{
                    model: School,
                    where: {
                        id: schoolId
                    }
                }]
            }
        ).then(
            arr => {
                const count = arr[0], rows = arr[1];
                if (count == 0) {
                    return req.status(404).send({"error": "not found"});
                } else {
                    return req.status(200).send(rows[0]);
                }
            },
            logServerError.bind(null, res)
        );
    })
    .delete((req, res) => {
        Teacher.destroy({
            where: { id: req.params.teacher_id },
            include: [{
                model: School,
                where: { id: req.params.school_id }
            }],
            limit: 1
        }).then(
            number => {
                if (number) {
                    return res.status(204).end();
                } else {
                    return res.status(404).end();
                }
            },
            logServerError.bind(null, res)
        );
    });

    router.route("/schools/:school_id/students/:student_id")
    .all(verifyAuthentication, tier(2), sameSchool)
    .get((req, res) => {
        Student.findOne({
            where: { id: req.params.student_id },
            include: [{
                model: School,
                where: { id: req.params.school_id }
            }]
        }).then(
            student => {
                if (student) {
                    res.send(student);
                } else {
                    res.status(404).send({"error": "not found"});
                }
            },
            logServerError.bind(null, res)
        );
    })
    .put((req, res) => {
        const student = res.body,
            schoolId = req.params.school_id,
            studentId = req.params.student_id;
        if (student.id !== void 0 && student.id != studentId) {
            return res.status(400).send({error: "bad request"});
        }
        delete student.id;
        Student.update(
            student,
            {
                where: { id: studentId },
                include: [{
                    model: School,
                    where: { id: schoolId }
                }]
            }
        ).then(
            arr => {
                const count = arr[0], rows = arr[1];
                if (count == 0) {
                    return req.status(404).send({"error": "not found"});
                } else {
                    return req.status(200).send(rows[0]);
                }
            },
            logServerError.bind(null, res)
        );
    })
    .delete((req, res) => {
        Student.destroy({
            where: { id: req.params.student_id},
            include: [{
                model: School,
                where: { id: req.params.school_id }
            }],
            limit: 1
        }).then(
            number => {
                if (number) {
                    return res.status(204).end();
                } else {
                    return res.status(404).end();
                }
            },
            logServerError.bind(null, res)
        );
    });

    router.route("/users").all(verifyAuthentication, tier(1));

}

function tier(n) {
    return function(req, res, next) {
        if (req.user.tier > n) {
            return res.status(401).send({ error: "unauthorized"});
        } else {
            return next();
        }
    };
}

function logServerError(res, error) {
    console.log(error);
    res.status(500).send({"error": "server error"});
}

function sameSchool(req, res, next) {
    if (req.user.tier <= 1) {
        return next();
    }
    req.user.getSchool().then(school => {
        if (school && school.id === req.params.school_id) {
            return next();
        } else {
            return res.status(401).send({
                error:
                    "unauthorized to view school data for school, id:"
                    + "{req.params.school_id}"
            });
        }
    });
}

function authorize(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return send422();
    }
    const parsed = Buffer.from(authHeader.slice(6), "base64").toString();
    const ix = parsed.indexOf(":"),
        username = parsed.slice(0, ix),
        password = parsed.slice(ix + 1);
    User.findOne({ username }).then(result => {
        if (result == null || !result.correctPassword(password)){
            return send422();
        }
        const sessionId = crypto.randomBytes(16).toString("base64");
        result.update({sessionId}).then(
            () => {
                res.cookie(
                    "SESSION_ID",
                    sessionId,
                    {
                        secure: config.https, 
                        maxAge: 1000 * 60 * 60 * 24 * 365 * 10
                    }
                );
                res.status(204).send();
            },
            () => {
                res.status(500).send({error: "could not assign session ID"});
            }
        );
    });
    function send422() {
        res.status(422).send({ error: "invalid format" });
    }
}
