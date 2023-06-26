const db = require("./db/dbConn");

async function checkEntityExists(field, value) {
  try {
    const query = `SELECT * FROM users WHERE ${field} = ?`;
    const result = await new Promise((resolve, reject) => {
      db.get(query, [value], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    return !!result;
  } catch (error) {
    console.error("Internal error: ", error);
    throw error;
  }
}
const jwt = require("jsonwebtoken");

async function getUserByEmail(email) {
  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    const result = await new Promise((resolve, reject) => {
      db.get(query, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    return result;
  } catch (error) {
    console.error("Internal error: ", error);
    throw error;
  }
}

function generateToken(payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })
  return token;
}

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: false,
    sameSite: "lax",
    expires: new Date(Date.now() + 600000), 
    //to self: 3600000 = 1 day , 60000 = 1 min (for testing purposes only)
  });
}

module.exports = {
  checkEntityExists,
  getUserByEmail,
  generateToken,
  setTokenCookie
};
