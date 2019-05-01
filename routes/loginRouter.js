let express = require("express");
let router = express.Router();
let passport = require('../middleware/passport');

router.get("/", (req, res) => {
  res.render("login");
});
router.post(
  "/",
  passport.authenticate("local", { successRedirect: "/member" })
);
router.get("/fb", passport.authenticate("facebook", { scope: ["email"] }));
router.get(
  "/fb/cb",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    successRedirect: "/"
  })
);

router.get('/gg',
  passport.authenticate('google',{ scope: ['email'] }));
router.get('/gg/cb', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
