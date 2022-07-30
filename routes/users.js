var express = require('express');
var router = express.Router();
const CryptoJS = require('crypto-js');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/new', function (req, res, next) {
    const userPassword = req.body.password;
    const encryptedUserPassword = CryptoJS.AES.encrypt(
        userPassword,
        process.env.SALT_KEY
    ).toString();

    req.app.locals.db
        .collection('users')
        .insertOne({
            userName: req.body.userName,
            password: encryptedUserPassword,
        })
        .then((result) => {
            res.send(result);
        });
});

router.post('/login', function (req, res, next) {
    const userName = req.body.userName;
    req.app.locals.db
        .collection('users')
        .findOne({ userName: userName })
        .then((result) => {
            res.send(result);
        });
});

module.exports = router;
