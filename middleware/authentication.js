
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
    const token = req.headers.authorization;  //check if token is provided in header's authorization
    if (token) {
        jwt.verify(token, "masai", (err, decoded) => {
            if (decoded) {
                req.body.user = decoded.userID;  //set the userID got during token (via user[0].id) to the user (to track which data belong to which user), user is given automatically in the Board schema
                next();
            }
            else {
                res.send({ "Message": "Please Login" });
            }
        })
    }
    else {
        res.send({ "Message": "Please Login" });
    }
}

module.exports = { authentication }