const Check = require("../models/check");
const visitService = require('../services/visitService');

exports.add_check = async (req, res, next) => {

    var objForCreate = { user_id: req.userData.userId };

    if (req.body.name) objForCreate.name = req.body.name;
    if (req.body.url) objForCreate.url = req.body.url;
    if (req.body.protocol) objForCreate.protocol = req.body.protocol;
    if (req.body.path) objForCreate.path = req.body.path;
    if (req.body.port) objForCreate.port = req.body.port;
    if (req.body.webhook) objForCreate.webhook = req.body.webhook;
    if (req.body.timeout) objForCreate.timeout = req.body.timeout;
    if (req.body.interval) objForCreate.interval = req.body.interval;
    if (req.body.threshold) objForCreate.threshold = req.body.threshold;
    if (req.body.threshold) objForCreate.remaining_threshold = req.body.threshold;
    if (req.body.authentication) objForCreate.authentication = req.body.authentication;
    if (req.body.httpHeaders) objForCreate.httpHeaders = req.body.httpHeaders;
    if (req.body.assert) objForCreate.assert = req.body.assert;
    if (req.body.assert_statusCode) objForCreate.assert_statusCode = req.body.assert_statusCode;
    if (req.body.tags) objForCreate.tags = req.body.tags;
    if (req.body.ignoreSSL) objForCreate.ignoreSSL = req.body.ignoreSSL;


    Check.create(objForCreate)
        .then((check) => {
            visitService.restartAll();
            res.status(201).json({
                message: "Check created",
                check: check
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
    Check.findOneAndRemove({ _id: req.params.checkId })
        .exec(function (err, item) {
            if (err) {
                return res.status(500).json({ msg: 'Cannot remove check' });
            }
            if (!item) {
                return res.status(404).json({ msg: 'check not found' });
            }
            visitService.restartAll();
            res.status(200).json({ msg: 'Check deleted.' });
        });
}

exports.pause_check = async (req, res, next) => {
    Check.findOneAndUpdate({ _id: req.params.checkId }, { paused: true }, { new: true })
        .exec((err, c) => {
            if (err) {
                return res.status(500).json({ msg: 'Server Error\tCannot pause check' });
            }
            if (!c) {
                return res.status(404).json({ msg: 'check not found' });
            }
            visitService.restartAll();
            res.status(200).json({ msg: 'Check paused.', check: c });
        });
}

exports.resume_check = async (req, res) => {
    Check.findOneAndUpdate({ _id: req.params.checkId }, { paused: false }, { new: true })
        .exec((err, c) => {
            if (err) {
                return res.status(500).json({ msg: 'Server Error\tCannot resume check' });
            }
            if (!c) {
                return res.status(404).json({ msg: 'check not found' });
            }
            visitService.restartAll();
            res.status(200).json({ msg: 'Check resumed.', check: c });
        });
}

exports.update_check = async (req, res, next) => {

    var objForUpdate = {};

    if (req.body.name) objForUpdate.name = req.body.name;
    if (req.body.url) objForUpdate.url = req.body.url;
    if (req.body.protocol) objForUpdate.protocol = req.body.protocol;
    if (req.body.path) objForUpdate.path = req.body.path;
    if (req.body.port) objForUpdate.port = req.body.port;
    if (req.body.webhook) objForUpdate.webhook = req.body.webhook;
    if (req.body.timeout) objForUpdate.timeout = req.body.timeout;
    if (req.body.interval) objForUpdate.interval = req.body.interval;
    if (req.body.threshold) objForUpdate.threshold = req.body.threshold;
    if (req.body.threshold) objForUpdate.remaining_threshold = req.body.threshold;
    if (req.body.authentication) objForUpdate.authentication = req.body.authentication;
    if (req.body.httpHeaders) objForUpdate.httpHeaders = req.body.httpHeaders;
    if (req.body.assert) objForUpdate.assert = req.body.assert;
    if (req.body.assert_statusCode) objForUpdate.assert_statusCode = req.body.assert_statusCode;
    if (req.body.tags) objForUpdate.tags = req.body.tags;
    if (req.body.ignoreSSL) objForUpdate.ignoreSSL = req.body.ignoreSSL;

    objForUpdate = { $set: objForUpdate }

    Check.findOneAndUpdate({ _id: req.params.checkId }, objForUpdate, { new: true })
        .exec((err, c) => {
            if (err) {
                return res.status(500).json({ msg: 'Cannot update check', err });
            }
            if (!c) {
                return res.status(404).json({ success: false, msg: 'check not found' });
            }
            visitService.restartAll();
            res.status(200).json({ msg: 'Check Updated.', check: c });
        });
}

exports.get_all_checks = async (req, res, next) => {
    Check.find({ user_id: req.userData.userId })
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
