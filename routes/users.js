var express = require('express');
var router = express.Router();
const CryptoJS = require('crypto-js');

async function checkForExistingUser(req, userName) {
    const userExists = await req.app.locals.db
        .collection('users')
        .findOne({ userName: userName });

    return userExists;
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send(checkForExistingUser(req, req.body.userName));
});

// Not optimal security with same token each session
router.post('/new', function (req, res, next) {
    checkForExistingUser(req, req.body.userName).then((result) => {
        if (!result) {
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
                    const objectId = result.insertedId.toHexString();
                    const cookieId = CryptoJS.AES.encrypt(
                        objectId,
                        process.env.SALT_KEY
                    );
                    res.cookie('id', cookieId.toString());
                    res.send(true);
                });
        } else {
            res.send(false);
        }
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
