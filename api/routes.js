const { signupController, loginController } = require('./controllers');

const router = require('express').Router();

// test route
router.get("/", (req, res) => {
  return res.json({
    message: "Meow from API 🐱",
  });
});

router.post("/signup", signupController);
router.post("/login", loginController);

module.exports = router;