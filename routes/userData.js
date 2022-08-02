var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');
const cookieParser = require('cookie-parser');
const app = require('../app');

app.use(cookieParser());

function convertObjectId(rawId) {
    const id = ObjectId(rawId);
    return id;
}

router.get('/', function (req, res, next) {
    const cookieId = CryptoJS.AES.decrypt(
        req.cookies.id,
        process.env.SALT_KEY
    ).toString(CryptoJS.enc.Utf8);
    const id = convertObjectId(cookieId);
    req.app.locals.db
        .collection('userData')
        .findOne({ _id: id })
        .toArray()
        .then((result) => res.send(result));
});

module.exports = router;
