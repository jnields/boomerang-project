export default function logServerError(req, res, error) {
    try {
        req.transaction.rollback().then(
            function success(){
                if (error.name.startsWith("Sequelize")) {
                    res.status(409).send(error.errors ? error.errors : error);
                } else {
                    console.log(error);
                    res.status(500).send({"error": "server error"});
                }
            },
            function err() {
                res.status(500).send({"error": "server error"});
            }
        );
    } catch(e) {
        res.status(500).send({"error": "server error"});
    }
}
