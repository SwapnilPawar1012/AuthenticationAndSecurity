//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-swapnil:Swapnil10@cluster0.etpx9uz.mongodb.net/userDB", { useNewUrlParser: true }).then(() => console.log("MongoDB connected!")).catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(() => res.render("secrets")).catch((err) => console.log(err));
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }).then(
        (foundUser) => {
            if (foundUser.password === password) {
                res.render("secrets")
            }
        }
    ).catch((err) => console.log(err));
});

app.listen(3000, function (req, res) {
    console.log("Server started on a port 3000.");
})