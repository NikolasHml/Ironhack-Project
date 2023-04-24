const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

router.get("/signup", (req, res, next) => {
    res.render("signup")
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

router.get("/login", (req, res, next) => {
    res.render("login")
  })
  
  router.post("/login", (req, res, next) => {
    const { username, email, password } = req.body
  
    // Find user in database by username
    User.findOne({ username })
      .then(userFromDB => {
        if (userFromDB === null) {
          // User not found in database => Show login form
          res.render("login", { message: "Wrong credentials" })
          return
        }
  
        // User found in database
        // Check if password from input form matches hashed password from database
        if (bcrypt.compareSync(password, userFromDB.password)) {
          // Password is correct => Login user
          // req.session is an object provided by "express-session"
          req.session.user = userFromDB
          res.redirect("/home")
        } else {
          res.render("login", { message: "Try again" })
          return
        }
      })
  })

  router.get("/home", (req, res, next) => {
    res.render("home")
})

  router.get("/profile", (req, res, next) => {
    res.render("profile")
})

module.exports = router