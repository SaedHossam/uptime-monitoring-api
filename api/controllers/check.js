const Check = require("../models/check");

exports.add_check = async (req, res, next) => {

    const check = new Check({
        user_id: req.userData.userId,
        name: req.body.name,
        url: req.body.url,
        protocol: req.body.protocol,
        path: req.body.path,
        port: req.body.port,
        webhook: req.body.webhook,
        timeout: req.body.timeout * 1000,
        interval: req.body.interval * 60 * 1000,
        threshold: req.body.threshold,
        remaining_threshold: req.body.threshold,
        authentication: req.body.authentication,
        httpHeaders: req.body.httpHeaders,
        assert: req.body.assert,
        assert_statusCode: req.body.assert_statusCode,
        tags: req.body.tags,
        ignoreSSL: req.body.ignoreSSL
    });

    check.save()
        .then(c => {

            res.status(201).json({
                message: "Check created",
                check: c
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error",
                error: err
            });
        });
}

exports.delete_check = async (req, res, next) => {
    Check.remove({ _id: req.params.checkId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Check deleted",
                result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.pause_check = async (req, res, next) => {
    Check.updateOne({ _id: req.params.checkId }, { paused: true })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Check Paused",
                result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


// TODO: if req.body.anyVal is null, then Ignore
exports.update_check = async (req, res, next) => {

    Check.updateOne({
        _id: req.params.checkId
    },
        {
            name: req.body.name,
            url: req.body.url,
            protocol: req.body.protocol,
            path: req.body.path,
            port: req.body.port,
            webhook: req.body.webhook,
            timeout: req.body.timeout,
            interval: req.body.interval,
            threshold: req.body.threshold,
            remaining_threshold: req.body.threshold,
            authentication: req.body.authentication,
            httpHeaders: req.body.httpHeaders,
            assert: req.body.assert,
            assert_statusCode: req.body.assert_statusCode,
            tags: req.body.tags,
            ignoreSSL: req.body.ignoreSSL
        })
        .then(c => {
            res.status(201).json({
                message: "Check Updated",
                check: c
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error",
                error: err
            });
        });
}

exports.get_all_checks = async (req, res, next) => {
    Check.find({})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "all Checks",
                list: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
