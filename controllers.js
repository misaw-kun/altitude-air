const bcrypt = require("bcrypt");
const {
  checkEntityExists,
  getUserByEmail,
  generateToken,
  setTokenCookie,
} = require("./helpers");
const db = require("./db/dbConn");

const signupController = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    // server side validation checks 🔐
    const usernameExists = await checkEntityExists("username", username);
    if (usernameExists) {
      throw new Error("Username is unavailable 🤚");
    }

    const emailExists = await checkEntityExists("email", email);
    if (emailExists) {
      throw new Error("Email already in use 🫱");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // user creation starts here...
    const createUserQuery = `INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)`;
    const userParams = [firstname, lastname, username, email, hashedPass];

    db.run(createUserQuery, userParams, (err) => {
      if (err) {
        console.error("Error storing user: ", err);
        return res.status(500).json({
          message: "Internal server error",
        });
      }

      return res.status(200).json({
        message: "Registration successful!! ✅",
      });
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // if using non-existent email (in db)
    const user = await getUserByEmail(email);
    console.log(user);
    if (!user) {
      throw new Error("⚠️ Invalid Email or Password");
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      throw new Error("⚠️ Invalid Email or Password");
    }

    // jwt starts here
    const token = generateToken({
      id: user.id,
      username: user.username,
    });

    setTokenCookie(res, token);

    res.status(200).json({
      message: "Login Successful 🔓",
      username: user.username,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = {
  signupController,
  loginController,
};
