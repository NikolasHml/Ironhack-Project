const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const Film = require("../models/Film.model")

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

router.get("/uploadFilm", (req, res, next) => {
    res.render("uploadFilm")
})

router.post("/uploadFilm", (req, res, next) => {
    console.log(req.body)
    const { title, brand, camera, asa, format, color, blackOrWhite, filter, location, startedFilm, endedFilm  } = req.body

    if (color == undefined && blackOrWhite == undefined) {
      res.render("uploadFilm", { message: "Color or black/white, one has to know this yo" })
      return}
    // else if (color == true && blackOrWhite == true) {
    //   res.render("uploadFilm", { message: "Color or black/white, you have to choose" })
    //   return}
    else {
      Film.create( { title, brand, camera, asa, format, color, blackOrWhite, filter, location, startedFilm, endedFilm } )
      .then(() => {
          res.redirect("/home")
      })
      .catch(error => next(error))
    }
})

// router.get("/edit", (req, res, next) => {

// })

module.exports = router