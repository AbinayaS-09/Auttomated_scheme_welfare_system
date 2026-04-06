const User = require("../models/User");// Import User model to interact with the users table in the database
const bcrypt = require("bcrypt");// Import bcrypt for hashing passwords securely
const jwt = require("jsonwebtoken");// Import jsonwebtoken for creating JWT tokens for authentication

exports.register = async (req, res) => {
  try {
    /*{
  "name": "Abinaya",
  "email": "abinaya@gmail.com",
  "password": "123456",
  "role": "user",
  "consent": true
}*/
    const { name, email, password, role, consent } = req.body;

    if (!consent)
      return res.status(400).json({ error: "Consent required" });
// Check if user with the same email already exists
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      consent,
    });
/*{
  "message": "Registered successfully",
  "user": {
    "id": 1,
    "name": "Abinaya",
    "email": "abinaya@gmail.com",
    "role": "user"
  }
}*/
    res.json({ message: "Registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const check = await bcrypt.compare(password, user.password);
    if (!check) return res.status(400).json({ error: "Wrong password" });
// Generate JWT token with user ID and role as payload, signed with a secret key, and set to expire in 1 day
   
//HEADER PAYLOAD SIGNATURE
const token = jwt.sign(
      { id: user.id, role: user.role },// Payload of the token includes user ID and role for authorization purposes
      process.env.JWT_SECRET,// Secret key for signing the JWT token, stored in environment variables for security
      { expiresIn: "1d" }// Token expires in 1 day
    );

    res.json({ message: "Login success", token, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
