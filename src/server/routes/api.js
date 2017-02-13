import orm from "../helpers/orm";
import {
    Student,
    School,
    User,
    Teacher,
    AuthMechanism
} from "../models";
import { QueryTypes } from "sequelize";
import crypto from "crypto";
import { Router } from "express";

const tenYears = 1000 * 60 * 60 * 24 * 365 * 10,
    cookieOptions = {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: tenYears
    },
    router = Router();

export default orm.sync().then(initializeRoutes).then(() => router);

function authenticate(req, res, next) {
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
        include: [{ model: AuthMechanism }]
    }).then(result => {
        if (result == null
                || result.authMechanism == null
                || !result.authMechanism.correctPassword(password)){
            return send422();
        }

        req.user = result;

        if (result.authMechanism.sessionId == null) {
            const sessionId = crypto.randomBytes(16).toString("base64");
            result.authMechanism.update({ sessionId }).then(
                () => {
                    success(sessionId);
                },
                logServerError.bind(null, res)
            );
        } else {
            success(result.authMechanism.sessionId);
        }
    });
    function send422() {
        res.status(422).send({ error: "invalid format" });
    }

    function success(sessionId) {
        res.cookie(
            "SESSION_ID",
            sessionId,
            cookieOptions
        );
        next();
    }
}

function verifySessionId(req, res, next) {
    let sessionId = req.cookies.SESSION_ID;
    if (sessionId && sessionId.length) {
        User.findOne({
            include: [{
                model: AuthMechanism,
                where: { sessionId }
            }]
        }).then(
            result => {
                if (result) {
                    req.user = result;
                    next();
                } else {
                    send403();
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

function getUserSchool(req, res, next) {
    orm.query(
        `
        select school.id
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
            tuser.id = ${req.user.id}
            or suser.id = ${req.user.id}
        )
        limit 1;
        `,
        { queryType: QueryTypes.SELECT }
    ).then(
        results => {
            req.schoolId =
                results[0].length 
                    ? results[0][0].id
                    : null;
            next();
        },
        logServerError.bind(null, res)
    );
}

function postType(type, schoolId, obj, res) {
    type = type.toLowerCase();
    const Model = getModel(type, res);
    if (Model == null) return;

    School.findOne({where:{id: schoolId}}).then(
        school => {
            if (school) {
                process(school);
            } else {
                return res.status(404).send({error: "not found"});
            }
        },
        logServerError.bind(null, res)
    );
    function process(school) {
        if (obj == null || obj.id != null || obj.user == null) {
            return res.stats(400).send({"error": "bad request"});
        }
        const password = obj.user.password;
        delete obj.user.password;
        if (password == null || obj.user.username == null) {
            return res.status(400).send({"error": "bad request"});
        }
        obj.user.authMechanism = {
            type: "BASIC"
        };
        switch(Model){
        case Teacher:
            obj.user.tier = "2";
            break;
        case Student:
            obj.user.tier = "3";
            break;
        }
        obj = Model.build(obj, {
            include: [
                {
                    association: Model.User,
                    include: [{
                        association: User.AuthMechanism
                    }]
                }
            ]
        });
        obj.user.authMechanism.setPassword(password);
        obj.setSchool(school, { save: false });
        return obj.save().then(
            saved => {
                saved = saved.toJSON();
                delete saved.user.authMechanism;
                res.set("Location", `/schools/${schoolId}/${type}/${saved.id}`)
                    .status(201)
                    .send(saved);
            },
            logServerError.bind(null,res)
        );
    }

}

function queryType(type, schoolId, query, res) {
    type = type.toLowerCase();
    const Model = getModel(type, res);
    if (Model == null) return;

    School.findOne({
        where: { id: schoolId },
        include: [{
            model: Model
        }]
    }).then(
        school => {
            if (school) {
                console.log(school.toJSON());
                res.send(school[type] || []);
            } else {
                res.status(404).send({"error": "not found"});
            }
        },
        logServerError.bind(null, res)
    );

}

function getTypeById(type, schoolId, id, res) {

    type = type.toLowerCase();
    const Model = getModel(type, res);
    if (Model == null) return;

    Model.findOne({
        where: { id },
        include: [{
            model: School,
            where: {
                id: schoolId
            }
        }]
    }).then(
        got => {
            return got
                ? res.send(got)
                : res.status(404).send({"error": "not found"});
        },
        logServerError.bind(null, res)
    );

}

function patchType(type, schoolId, id, obj, res) {
    type = type.toLowerCase();
    const Model = getModel(type, res);
    if (Model == null) return;

    if (obj.id !== undefined && id != obj.id) {
        return res.status(400).send({"error": "id mismatch"});
    }

    delete obj.id, obj.schoolId, obj.school;

    const include = [{
        model: School,
        where: {
            id: schoolId
        }
    }];
    if (obj.user) {
        const userInclude = {
            model: User
        };
        if (obj.user.password) {
            userInclude.include = [{
                model: AuthMechanism
            }];
            const authMechanism = AuthMechanism.build({});
            authMechanism.setPassword(obj.user.password);
            delete obj.user.password;
            obj.user.authMechanism = {
                salt: authMechanism.salt,
                hash: authMechanism.hash,
                sessionId: null
            };
        }
        include.push(userInclude);
    }

    Model.findOne({ where: { id }, include }).then(
        existing => {
            if (!existing)
                return res.status(404).send();
            const promises = [];
            if (obj.user) {
                if (obj.user.authMechanism) {
                    promises.push(
                        existing.user.authMechanism.update(
                            obj.user.authMechanism
                        )
                    );
                    delete obj.user.authMechanism;
                }
                promises.push(
                    existing.user.update(obj.user)
                );
                delete obj.user;
            }
            existing.update(obj).then(
                self => {
                    Promise.all(promises).then(()=>{
                        self = self.toJSON();
                        if (self.user)
                            delete self.user.authMechanism;
                        res.send(self);
                    });
                },
                logServerError.bind(null, res)
            );
        }
    );
}

function deleteType(type, schoolId, id, res) {
    type = type.toString();
    const Model = getModel(type, res);
    if (Model == null) return;

    Model.findOne({
        where: { id },
        include: [{
            model: School,
            where: { id: schoolId }
        }]
    }).then(
        existing => {
            if (existing) {
                existing.destroy().then(
                    () => {
                        res.status(204).send();
                    },
                    logServerError.bind(null,res)
                );
            } else {
                return res.status(404).end();
            }

        },
        logServerError.bind(null, res)
    );

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
    if (error.name.startsWith("Sequelize")) {
        return res.status(409).send(error.errors ? error.errors : error);
    } else {
        console.log(error);
        res.status(500).send({"error": "server error"});
    }
}

function getModel(type, res) {
    switch(type) {
    case "students":
        return Student;
    case "teachers":
        return Teacher;
    default:
        res.status(404).send({"error": "endpoint not found"});
        return null;
    }
}

function initializeRoutes() {

    router.use(authenticate, getUserSchool);

    router.head("/", (req,res) => {
        res.status(204).send();
    });

    router.route("/schools")
    .all(tier(1))
    .get((req,res) => {
        const limit = Math.min(req.query.$pageSize || 10, 1000),
            offset = limit * (req.query.$page || 0),
            $like = req.query.name$like;
        let attributes = req.query.$select || void 0;
        if (attributes && !Array.isArray(attributes)){
            attributes = [ attributes ];
        }
        console.log("QUERY: ", req.query);
        School.findAll({
            attributes,
            where: { name: { $like }},
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
                        .send(saved);
                },
                logServerError.bind(null, res)
            );
        }
    });

    router.route("/schools/:school_id")
    .all(tier(1))
    .get((req,res) => {
        School.findOne({ where: { id: req.params.school_id } }).then(
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
    .patch((req, res) => {
        const school = req.body;
        if (!school
                || (school.id != null && school.id != req.params.school_id)) {
            return res.status(400).send({"error": "ID mismatch"});
        }
        delete school.id;
        School.update(school, {where: { id: req.params.school_id }}).then(
            arr => {
                const count = arr[0];
                if (count == 0) {
                    return res.status(404).send({"error": "not found"});
                } else {
                    return res.status(204).send();
                }
            }
        );
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

    router.route("/schools/:school_id/:type")
    .all(tier(1))
    .get((req,res) => {
        queryType(
            req.params.type,
            req.params.school_id,
            req.query,
            res
        );
    })
    .post((req, res) => {
        postType(
            req.params.type,
            req.params.school_id,
            req.body,
            res
        );
    });

    router.route("/schools/:school_id/:type/:id")
    .all(tier(1))
    .get((req, res) => {
        getTypeById(
            req.params.type,
            req.params.school_id,
            req.params.id,
            res
        );
    })
    .patch((req, res) => {
        patchType(
            req.params.type,
            req.params.school_id,
            req.params.id,
            req.body,
            res
        );
    })
    .delete((req, res) => {
        deleteType(
            req.params.type,
            req.params.school_id,
            req.params.id,
            res
        );
    });

    router.route("/users")
    .all(tier(1))
    .get((req, res) => {
        const limit = Math.min(req.query.$pageSize || 10, 1000),
            offset = limit * (req.query.$page || 0);
        User.findAll({
            where: { },
            limit,
            offset
        }).then(
            users => {
                res.send(users);
            },
            logServerError.bind(null, res)
        );
    })
    .post((req, res) => {
        const user = req.body;
        if (user == null || user.id != null) {
            return res
                .status(400)
                .send({"error": "bad request"});
        }
        User.create(user).then(
            created => {
                res.send(created);
            },
            logServerError.bind(null, res)
        );
    });

    router.route("/users/:id")
    .all(tier(1))
    .get((req, res) => {
        User.findOne({ where: { id: req.params.id }}).then(
            user => {
                if (user) {
                    res.send(user);
                } else {
                    res.status(404).send();
                }
            },
            logServerError.bind(null, res)
        );
    })
    .patch((req, res) => {
        const updates = req.body;
        if (updates.id != null && updates.id != req.params.id) {
            return res.status(400).send({"error": "bad request"});
        }
        if (req.params.id == req.user.id) {
            delete updates.tier;
        }
        let include = void 0;
        if (updates.password) {
            include = [{
                model: AuthMechanism
            }];
            const authMechanism = AuthMechanism.build({});
            authMechanism.setPassword(updates.password);
            updates.authMechanism = {
                salt: authMechanism.salt,
                hash: authMechanism.hash,
                sessionId: null
            };
            delete updates.password;
        }
        User.findOne({
            where: { id: req.params.id },
            include
        }).then(
            existing => {
                if (existing == null)
                    return res.status(404).send();
                existing.update(updates).then(
                    updated => {
                        res.send(updated);
                    },
                    logServerError.bind(null, res)
                );
            },
            logServerError.bind(null, res)
        );
    })
    .delete((req, res) => {
        const id = req.params.id;
        if (req.user.id == id) {
            return res.status(400).send({"error": "bad request"});
        }
        User.delete({ where: {id}}).then(
            count => {
                if (count) {
                    return res.status(204).send();
                } else {
                    return res.status(404).send();
                }
            },
            logServerError.bind(null, res)
        );
    });

    router.route("/students")
    .all(tier(2))
    .post((req,res) => {
        postType(
            "students",
            req.schoolId,
            req.body,
            res
        );
    })
    .get((req,res) => {
        queryType(
            "students",
            req.schoolId,
            req.query,
            res
        );
    });

    router.route("/teachers")
    .all(tier(2))
    .get((req,res) => {
        queryType(
            "teachers",
            req.schoolId,
            req.query,
            res
        );
    })
    .post((req, res) => {
        postType(
            "teachers",
            req.schoolId,
            req.body,
            res
        );
    });

    router.route("/teachers/:id")
    .all(tier(2))
    .get((req,res) => {
        getTypeById(
            "teachers",
            req.schoolId,
            req.params.id,
            res
        );
    })
    .patch((req, res) => {
        patchType(
            "teachers",
            req.schoolId,
            req.params.id,
            req.body,
            res
        );
    });

    router.route("/students/:id")
    .all(tier(2))
    .get((req, res) => {
        getTypeById(
            "students",
            req.schoolId,
            req.params.id,
            res
        );
    })
    .patch((req, res) => {
        patchType(
            "students",
            req.schoolId,
            req.params.id,
            req.body,
            res
        );
    });
}
