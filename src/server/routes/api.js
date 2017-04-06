import orm from "../helpers/orm";
import {
    Student,
    School,
    User,
    Teacher,
    AuthMechanism
} from "../models";
import { Router } from "express";
import logServerError from "../helpers/log-server-error";

const router = Router();

export default orm.sync().then(initializeRoutes).then(() => router);

function startTransaction(req,res,next) {
    orm.transaction({
        autocommit: false,
        isolationLevel: "READ COMMITTED"
    }).then(
        transaction => {
            req.transaction = transaction;
            next();
        },
        error => {
            console.log(error);
            res.status(500).send();
        }
    );
}

function json(req, res, next) {
    res.type("json");
    next();
}

function postType(type, req, res) {
    const schoolId = req.params.school_id || req.schoolId,
        transaction = req.transaction;
    let obj = req.body;

    type = type.toLowerCase();
    const Model = getModel(type, res);
    if (Model == null)
        return transaction.commit().then(
            () => res.stats(404).send({error: "not found"}),
            logServerError.bind(null, req, res)
        );

    School.findOne({where:{id: schoolId}, transaction})
    .then(school => process(school))
    .catch(logServerError.bind(null, req, res));

    function process(school) {
        if (school == null) {
            return transaction.commit().then(
                () => res.status(404).send({error: "not found"})
            );
        }

        if (obj == null || obj.id != null || obj.user == null) {
            return res.status(400).send({"error": "bad request"});
        }
        const password = obj.user.password;
        delete obj.user.password;
        switch(Model){
        case Teacher:
            obj.user.tier = "2";
            break;
        case Student:
            obj.user.tier = "3";
            break;
        }
        if (password == null || obj.user.username == null) {
            obj = Model.build(
                obj,
                {
                    include: [{
                        association: Model.User
                    }]
                }
            );
        } else {
            obj.user.authMechanism = {
                type: "BASIC"
            };
            obj = Model.build(
                obj,
                {
                    include: [
                        {
                            association: Model.User,
                            include: [{
                                association: User.AuthMechanism
                            }]
                        }
                    ]
                }
            );
            obj.user.authMechanism.setPassword(password);
        }
        obj.setSchool(school, { save: false });
        return obj.save({transaction})
            .then(saved => transaction.commit().then(() => saved))
            .then(saved => {
                saved = saved.toJSON();
                delete saved.user.authMechanism;
                res.set("Location", `/schools/${schoolId}/${type}/${saved.id}`)
                    .status(201)
                    .send(saved);
            });
    }
}

function queryType(type, req, res) {
    const schoolId = req.params.school_id || req.schoolId,
        transaction = req.transaction;

    type = type.toLowerCase();
    const Model = getModel(type, res);
    if (Model == null)
        return transaction.commit().then(
            () => res.stats(404).send({"error": "not found"}),
            logServerError.bind(null, res)
        );

    School.findOne({
        where: { id: schoolId },
        include: [{
            model: Model,
            include: [{ model: User }]
        }],
        transaction
    }).then(school => transaction.commit().then(() => {
        if (school == null) {
            res.status(404).send({"error": "not found"});
        } else {
            res.send(school[type] || []);
        }
    })).catch(logServerError.bind(null, req, res));

}

function getTypeById(type, req, res) {
    const id = req.params.id,
        schoolId = req.params.school_id || req.schoolId,
        transaction = req.transaction;

    type = type.toLowerCase();
    const Model = getModel(type, res);
    if (Model == null)
        return transaction.commit().then(
            () => res.stats(404).send({"error": "not found"}),
            logServerError.bind(null, res)
        );

    Model.findOne({
        where: { id },
        include: [
            {
                model: School,
                where: {
                    id: schoolId
                }
            },
            { model: User }
        ],
        transaction
    })
    .then(got => transaction.commit().then(() => {
        return got
            ? res.send(got)
            : res.status(404).send({"error": "not found"});
    }))
    .catch(logServerError.bind(null, req, res));

}

function patchType(type, req, res) {
    const id = req.params.id,
        schoolId = req.params.school_id || req.schoolId,
        obj = req.body,
        transaction = req.transaction;

    type = type.toLowerCase();
    const Model = getModel(type, res);
    if (Model == null)
        return transaction.commit().then(
            () => res.stats(404).send({"error": "not found"}),
            logServerError.bind(null, res)
        );

    if (obj.id !== undefined && id != obj.id) {
        return transaction.commit().then(
            ()=>res.status(400).send({"error": "id mismatch"}),
            logServerError.bind(null, req, res)
        );
    }

    delete obj.id, obj.schoolId, obj.school;

    const include = [
        {
            model: School,
            where: {
                id: schoolId
            }
        },
        { model: User }
    ];

    if (obj.user && obj.user.password) {
        const userInclude = include[1];
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

    Model.findOne({ where: { id }, include, transaction })
    .then(existing => {
        if (existing == null)
            return transaction.commit().then(() => res.status(404).send());
        const promises = [];
        if (obj.user) {
            existing.user = existing.user || User.build({
                tier: type === "teachers" ? "2" : "3"
            });
            if (obj.user.authMechanism) {
                promises.push(
                    existing.user.authMechanism.update(
                        obj.user.authMechanism,
                        {transaction}
                    )
                );
                delete obj.user.authMechanism;
            }
            promises.push(
                existing.user.update(obj.user, { transaction })
            );
        }
        return Promise.all(promises).then(() => {
            obj.user = existing.user;
            return existing.update(obj, {transaction})
            .then(self => transaction.commit().then(()=>{
                self = self.toJSON();
                if (self.user)
                    delete self.user.authMechanism;
                return res.send(self);
            }));
        });
    }).catch(logServerError.bind(null, req, res));
}

function deleteType(type, req, res) {
    const id = req.params.id,
        schoolId = req.params.school_id || req.schoolId,
        transaction = req.transaction;

    type = type.toString();
    const Model = getModel(type, res);
    if (Model == null)
        return transaction.commit().then(
            () => res.stats(404).send({"error": "not found"}),
            logServerError.bind(null, res)
        );

    Model.findOne({
        where: { id },
        include: [{
            model: School,
            where: { id: schoolId }
        }],
        transaction
    }).then(existing => {
        if (existing == null) {
            return transaction.commit().then(() =>res.status(404).end());
        }
        return existing.destroy().then(
            transaction.commit().then(()=>
                res.status(204).send()
            )
        );
    }).catch(logServerError.bind(null, req, res));

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

function enforceAuthenticated(req, res, next) {
    req.schoolId = req.school ? req.school.id : null;
    if (req.user == null)
        return res.status(401).send({error: "unauthenticated"});
    else
        return next();
}

function initializeRoutes() {

    router.use(enforceAuthenticated, startTransaction, json);

    router.head("/", (req,res) => {
        res.status(204).send();
    });

    router.route("/logout")
    .get((req, res) => {
        res.cookie(
            "SID",
            "",
            {
                secure: process.env.NODE_ENV === "production",
                maxAge: 0,
                httpOnly: true
            }
        );
        res.status(204).send();
    });

    router.route("/login")
    .get((req, res) => {
        const user = req.user.toJSON();
        user.school = req.school ? req.school.toJSON() : null;
        user.schoolId = req.schoolId;
        req.transaction.commit().then(
            () => res.send(user),
            logServerError.bind(null, req, res)
        );
    });

    router.route("/schools")
    .all(tier(1))
    .get((req,res) => {
        const limit = req.query.$limit,
            offset = limit * req.query.$offset,
            $like = req.query.name$like;

        let attributes = req.query.$select || void 0;

        if (attributes && !Array.isArray(attributes)){
            attributes = [ attributes ];
        }

        const where = $like
            ? { name: { $like } }
            : void 0;

        const query = {
            transaction: req.transaction
        };
        if(attributes) query.attributes = attributes;
        if(where) query.where = where;
        if(limit) query.limit = limit;
        if(offset) query.offset = offset;

        School.findAll(query)
            .then(schools =>
                req.transaction.commit()
                    .then(() => res.send(schools))
            )
            .catch(logServerError.bind(null, req, res));
    })
    .post((req, res) => {
        const school = req.body,
            transaction = transaction;
        if (school.id) {
            return transaction.commit().then(
                () => res.status(422)
                    .send({"error": "explicit value provided for id"})
            );
        }
        return School.create(school, { transaction: req.transaction })
            .then(
                saved => req.transaction.commit().then(
                    () => res
                        .set("Location", `/schools/${saved.id}`)
                        .status(201)
                        .send(saved)
                )
            )
            .catch(logServerError.bind(null, req, res));
    });

    router.route("/schools/:school_id")
    .all(tier(1))
    .get((req,res) => {
        const transaction = req.transaction,
            id = req.params.school_id;
        School.findOne({
            where: { id },
            transaction
        })
        .then(school => transaction.commit().then(
            () => {
                if (school) {
                    return res.send(school);
                }
                return res.status(404).send({ error: "not found" });
            }
        ))
        .catch(logServerError.bind(null, req, res));
    })
    .patch((req, res) => {
        const school = req.body,
            transaction = req.transaction;
        if (!school
                || (school.id != null && school.id != req.params.school_id)) {
            return transaction.commit().then(
                () => res.status(400).send({"error": "ID mismatch"}),
                logServerError.bind(null, req, res)
            );
        }
        delete school.id;
        School.findOne({
            where: { id: req.params.school_id },
            transaction
        })
        .then(existing => {
            if (!existing) {
                return transaction.commit().then(
                    () => res.status(404).send({"error": "not found"}),
                );
            }
            return existing.update(school, {transaction})
            .then(self => transaction.commit().then(
                () => res.status(200).send(self)
            ));
        }).catch(logServerError.bind(null, req, res));
    })
    .delete((req, res) => {
        const id = req.params.school_id,
            transaction = req.transaction;

        if (id == null)
            return res.status(400).send({"error": "no id specified to delete"});
        School.destroy({ where: {id}, limit: 1, transaction})
            .then(number => transaction.commit().then(() => {
                res.status(number === 0 ? 404 : 204).end();
            }))
            .catch(logServerError.bind(null, req, res));
    });

    router.route("/schools/:school_id/:type")
    .all(tier(1))
    .get((req,res) => {
        queryType(
            req.params.type,
            req,
            res
        );
    })
    .post((req, res) => {
        postType(
            req.params.type,
            req,
            res
        );
    });

    router.route("/schools/:school_id/:type/:id")
    .all(tier(1))
    .get((req, res) => {
        getTypeById(
            req.params.type,
            req,
            res
        );
    })
    .patch((req, res) => {
        patchType(
            req.params.type,
            req,
            res
        );
    })
    .delete((req, res) => {
        deleteType(
            req.params.type,
            req,
            res
        );
    });

    router.route("/users")
    .all(tier(1))
    .get((req, res) => {
        const limit = Math.min(req.query.$pageSize || 10, 1000),
            offset = limit * (req.query.$page || 0),
            transaction = req.transaction;
        User.findAll({
            where: { },
            transaction,
            limit,
            offset
        })
        .then(users => transaction.commit().then(() => res.send(users)))
        .catch(logServerError.bind(null, req, res));
    })
    .post((req, res) => {
        const user = req.body,
            transaction = req.transaction;

        if (user == null || user.id != null) {
            return res
                .status(400)
                .send({"error": "bad request"});
        }
        User.create(user, {transaction})
        .then(created => transaction.commit().then(() => res.send(created)))
        .catch(logServerError.bind(null, req, res));
    });

    router.route("/users/:id")
    .all(tier(1))
    .get((req, res) => {
        const transaction = req.transaction,
            id = req.params.id;
        User.findOne({ transaction, where: { id }})
        .then(user => transaction.commit().then(
            ()=> {
                if (user) {
                    res.send(user);
                } else {
                    res.status(404).send({error: "not found"});
                }
            }
        ))
        .catch(logServerError.bind(null, req, res));
    })
    .patch((req, res) => {
        const updates = req.body,
            transaction = req.transaction;

        if (updates.id != null && updates.id != req.params.id) {
            return transaction.commit().then(
                () => res.status(400).send({"error": "bad request"})
            );
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
            include,
            transaction
        })
        .then(existing => {
            if (existing == null)
                return transaction
                    .rollback()
                    .then(() => res.status(404).send());
            return existing.update(updates, {transaction})
                .then(updated => transaction.commit().then(
                    () => res.send(updated)
                ));
        })
        .catch(logServerError.bind(null, req, res));

    })
    .delete((req, res) => {
        const id = req.params.id,
            transaction = req.transaction;
        if (req.user.id == id) {
            return transaction.commit().then(
                () => res.status(400).send({"error": "bad request"}),
                logServerError.bind(null, req, res)
            );
        }
        return User.delete({ where: {id}, transaction})
        .then(count => transaction.commit().then(
            () => res.status(count ? 204 : 404).send()
        )).catch(logServerError.bind(null, req, res));
    });

    router.route("/students")
    .all(tier(2))
    .post((req,res) => {
        postType(
            "students",
            req,
            res
        );
    })
    .get((req,res) => {
        queryType(
            "students",
            req,
            res
        );
    });

    router.route("/teachers")
    .all(tier(2))
    .get((req,res) => {
        queryType(
            "teachers",
            req,
            res
        );
    })
    .post((req, res) => {
        postType(
            "teachers",
            req,
            res
        );
    });

    router.route("/teachers/:id")
    .all(tier(2))
    .get((req,res) => {
        getTypeById(
            "teachers",
            req,
            res
        );
    })
    .patch((req, res) => {
        patchType(
            "teachers",
            req,
            res
        );
    })
    .delete((req,res) => {
        deleteType(
            "teachers",
            req,
            res
        );
    });

    router.route("/students/:id")
    .all(tier(2))
    .get((req, res) => {
        getTypeById(
            "students",
            req,
            res
        );
    })
    .patch((req, res) => {
        patchType(
            "students",
            req,
            res
        );
    })
    .delete((req,res) => {
        deleteType(
            "students",
            req,
            res
        );
    });
}
