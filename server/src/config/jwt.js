const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "ZeroCivicSenseSecretKey";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate a JWT token.
 * @param {object} payload
 * @returns {string}
 */
const generateToken = (payload) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

/**
 * Verify a JWT token.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => jwt.verify(token, SECRET);

module.exports = { generateToken, verifyToken };
