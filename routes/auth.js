const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

router.get("/signup", (req, res, next) => {
    res.render("signup")
})

router.get("/login", (req, res, next) => {
    res.render("login")
})

router.post("/signup", (req, res, next) => {
    const { username, email, password } = req.body

    User.findOne({username: username})
    .then(userFromDb => {
        if ( userFromDb !== null) {
            res.render("signup", { message: "Already taken"})
            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        User.create({username, email, password: hash })
        .then(() => {
            res.redirect("/login")
        })
        
    })

})

router.get("/profile", (req, res, next) => {
    res.render("profile")
})

module.exports = router