const createToken = require("../lib/auth").createToken;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.login = (req, res, next) => {
  const {email, password} = req.body;
  User.findOne({
    where: {email},
  })
      .then((data) => {
        if (!data) {
          return Promise.reject("invalid");
        } else {
          return bcrypt.compare(password, data.password).then((valid) => {
            if (!valid) {
              return Promise.reject("invalid");
            } else {
              return Promise.resolve(data);
            }
          });
        }
      })
      .then((user) =>
          createToken({email: user.email}).then((token) =>
              res.json({token})
          )
      )
      .catch((err) =>
          err === "invalid"
              ? res.status(400).json({
                email: "Invalid credentials",
                password: "Invalid credentials",
              })
              : console.error(err) || res.sendStatus(500)
      );
};

exports.createUser = (req, res, next) => {
  const {email, password} = req.body;
  User.create({
    email,
    password: bcrypt.hashSync(password)
  })
      .then((data) => res.status(201).json(data))
      .catch((error) => {
        res.status(400).json(error);
      });
}
