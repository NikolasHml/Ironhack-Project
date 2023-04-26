const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const {isLoggedIn} = require("../middleware/route-guard")
const Film = require("../models/Film.model")
// const uploader = require("../config/cloudinary")
//
const { uploader, cloudinary } = require("../config/cloudinary")

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
          res.render("login", { message: "Wrong username, try again" })
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

  router.get("/home", isLoggedIn, (req, res, next) => {
    Film.find()
      .then(allFilms => {
        res.render("home.hbs", { films: allFilms})
      })
      .catch(error => {
        next(error)
      })
    //res.render("home")
})

  router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("profile", {user: req.session.user})
})

  router.get("/uploadFilm", isLoggedIn, (req, res, next) => {
    res.render("uploadFilm")
})

router.post("/uploadFilm", uploader.single("picture"), (req, res, next) => {
    console.log(req.body)
    const { title, brand, camera, asa, blackWhiteOrColor, format, filter, location, startedFilm, endedFilm  } = req.body

    // if (title == undefined || brand == undefined || camera == undefined || asa == undefined || format == undefined || blackWhiteOrColor == undefined || filter == undefined) {
    //   Film.create( { title, brand, camera, asa, blackWhiteOrColor, format, filter, location, startedFilm, endedFilm } )
    //     .then(() => {
    //       res.render("uploadFilm", { message: "Please fill out the required fields" } )
    //     })
        //.then((createdFilm) => {
        // dann irgwie filmfinden und dann muss ichs updaten oder so
        //})
    //}
    //else {
      Film.create( { imageUrl: req.file.path, title, brand, camera, asa, blackWhiteOrColor, format, filter, location, startedFilm, endedFilm } )
        .then(() => {
            res.redirect("/home")
        })
        .catch(error => next(error))  
    //}
})

router.get("/editFilm", isLoggedIn, (req, res, next) => {
    res.render("editFilm")
})

router.get("/logout", (req, res, next)=> {
    req.session.destroy()
    res.redirect("/login")
})



module.exports = router