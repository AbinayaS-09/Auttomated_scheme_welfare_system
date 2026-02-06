const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, consent } = req.body;

    if (!consent)
      return res.status(400).json({ error: "Consent required" });

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

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login success", token, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
