let express = require("express");
let app = express();
let expressHbs = require("express-handlebars");
let bodyParser = require("body-parser");
let passport = require("./middleware/passport");
let session = require("express-session");
let models = require("./models");
let fs = require('fs');
let https = require('https');
let path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));
app.engine(
  "hbs",
  expressHbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
  })
);

app.set("view engine", "hbs");

app.get("/sync", (req, res) => {
  models.sequelize.sync().then(() => {
    res.send("database create");
  });
});

app.get("/", (req, res) => {
  res.render("index");
});

let loginRouter = require('./routes/loginRouter');

app.use("/login", loginRouter);

let isAuthenticated = require("./middleware/isAuthenticated");

app
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post((req, res) => {
    models.User.create({
      username: req.body.username,
      password: req.body.password
    }).then(user => {
      res.redirect(307, "/login");
    });
  });

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/member", isAuthenticated, (req, res) => {
  res.render("member");
});

app.set("port", process.env.PORT || 3000);

// start server
// app.listen(app.get("port"), () => {
//   console.log("server is  listening on port " + app.get("port"));
// });

https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'))
}, app)
.listen(app.get("port"), function () {
  console.log("server is  listening on port " + app.get("port"));
})
