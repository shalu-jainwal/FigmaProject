const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

let newUsermail = "user@gmail.com";
let newUsername = "User";
let newUserlog = "Login";

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/clientDB", {
  useNewUrlParser: true
});

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const Client = new mongoose.model("Client", clientSchema);

app.route("/clients")

  .get(function(req, res) {
    Client.find(function(err, foundClients) {
      if (!err) {
        res.send(foundClients);
      } else {
        res.send(err);
      }
    });
  });

app.get("/", function(req, res) {
  res.render("index", {
    userMail: newUsermail,
    userName: newUsername,
    userLog: newUserlog
  });
});

app.get("/login", function(req, res) {
  res.render("index", {
    userMail: newUsermail,
    userName: newUsername,
    userLog: newUserlog
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {

  const newClient = new Client({
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password)
  });

  newClient.save(function(err) {
    if (err) {
      newUsername = "User";
      res.redirect("/");
    } else {
      newUsername = req.body.name;
      res.redirect("/");
    }
  });
});

app.post("/login", function(req, res) {

  const email = req.body.email;
  const password = md5(req.body.password);

  Client.findOne({
    email: email
  }, function(err, foundClient) {
    if (err) {
      newUsermail = "user@gmail.com";
      newUserlog = "Login";
      res.redirect("/");
    } else {
      if (foundClient) {
        if (foundClient.password === password) {
          newUsermail = req.body.email;
          newUserlog = "Logout";
          res.redirect("/");
        }
      }
    }
  })
});

app.listen(3000, function(req, res) {
  console.log("Server is running on port 3000");
});
