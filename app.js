const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const { body, validationResult } = require("express-validator");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "kawkaw",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(csurf({ cookie: true }));

// database
const users = [
  { username: "kawtar", password: "kawkaw2@" },
  { username: "meriem", password: "mimi2@" },
  { username: "hanan", password: "hanan2@" },
];

// Routes
app.get("/", (req, res) => {
  if (req.session.isAuthenticated) {
    res.render("dashboard");
  } else {
    res.render("index", { csrfToken: req.csrfToken() });
  }
});

app.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required").trim(),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 6 characters long")
      .escape(),
  ],
  (req, res) => {
    // Validate and authenticate the user
    // Implement appropriate validation and secure authentication mechanisms here
    // For simplicity, you can use a hardcoded username and password for demonstration purposes

    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("index", {
        csrfToken: req.csrfToken(),
        errors: errors.array(),
      });
    }
    const findUser = users.find((user) => {
      return user.username === username && user.password === password;
    });
    console.log(findUser);
    if (findUser) {
      req.session.user = username;
      req.session.isAuthenticated = true;
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
  }
);

app.get("/dashboard", (req, res) => {
  // Secure the dashboard route to only allow authenticated users
  if (req.session.isAuthenticated) {
    res.render("dashboard", { user: req.session.user });
  } else {
    res.redirect("/");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
