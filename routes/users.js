var express = require('express');
var router = express.Router();
const CryptoJS = require('crypto-js');

async function getUserData(userName) {}

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/new', function (req, res, next) {
    const password = req.body.password;
    const encryptedUserPassword = CryptoJS.AES.encrypt(
        password,
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
    const password = req.body.password;
    req.app.locals.db
        .collection('users')
        .findOne({ userName: userName })
        .then((result) => {
            if (
                password ===
                CryptoJS.AES.decrypt(
                    result.password,
                    process.env.SALT_KEY
                ).toString(CryptoJS.enc.Utf8)
            ) {
                res.send(true);
            } else {
                res.send(false);
            }
        });
});

module.exports = router;
