const { ExtractJwt, Strategy } = require("passport-jwt");
const { User } = require("../db/models");
require("dotenv").config();

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_ENCRYPTION;

  passport.use(
    new Strategy(opts, async function (jwtPayload, done) {
      User.findOne({
        where: { id: jwtPayload.user_id },
      })
        .then((user) => {
          if (user) return done(null, user);
          else return done(null, false);
        })
        .catch((err) => {
          return done(err, false);
        });
    })
  );
};
