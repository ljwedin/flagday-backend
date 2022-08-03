var express = require('express');
var router = express.Router();
const CryptoJS = require('crypto-js');
const { ObjectId } = require('mongodb');

router.get('/', function (req, res, next) {
    const cookieId = CryptoJS.AES.decrypt(
        req.cookies.id,
        process.env.SALT_KEY
    ).toString(CryptoJS.enc.Utf8);

    req.app.locals.db
        .collection('userData')
        .findOne({ userId: cookieId })
        .then((result) => res.send(result));
});

router.post('/updateCountry', function (req, res, next) {
    const cookieId = CryptoJS.AES.decrypt(
        req.cookies.id,
        process.env.SALT_KEY
    ).toString(CryptoJS.enc.Utf8);

    req.app.locals.db
        .collection('userData')
        .updateOne(
            { userId: cookieId },
            { $set: { country: req.body.country } }
        )
        .then((result) => res.send(true));
});

router.post('/updateFlag', function (req, res, next) {
    const cookieId = CryptoJS.AES.decrypt(
        req.cookies.id,
        process.env.SALT_KEY
    ).toString(CryptoJS.enc.Utf8);

    req.app.locals.db
        .collection('userData')
        .updateOne({ userId: cookieId }, { $set: { flag: req.body.flag } })
        .then((result) => res.send(true));
});

router.post('/addFlagDay', function (req, res, next) {
    const cookieId = CryptoJS.AES.decrypt(
        req.cookies.id,
        process.env.SALT_KEY
    ).toString(CryptoJS.enc.Utf8);

    const flagDay = {
        month: req.body.month,
        day: req.body.day,
        occasion: req.body.occasion,
        id: req.body.id,
    };

    req.app.locals.db
        .collection('userData')
        .updateOne({ userId: cookieId }, { $push: { flagDays: flagDay } })
        .then((results) => {
            res.send(true);
        });
});

module.exports = router;
