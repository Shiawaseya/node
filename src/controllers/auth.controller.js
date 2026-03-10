const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/env");
const { getPool, sql } = require("../db/connection");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const pool = getPool();
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Database connection not available" });
    }

    // Query the account table
    const result = await pool
      .request()
      .input("email", sql.NVarChar, username)
      .query(
        "SELECT acount_id, employee_id, user_email, user_password, is_approved, route_access FROM account WHERE user_email = @email",
      );

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.recordset[0];

    // Check if account is approved
    if (user.is_approved !== "Yes" && user.is_approved !== "approved") {
      return res.status(403).json({ message: "Account not approved" });
    }

    // Check password (try both plain text and bcrypt)
    let isMatch = false;
    if (password === user.user_password) {
      // Plain text match (for legacy passwords)
      isMatch = true;
    } else {
      // Try bcrypt comparison
      try {
        isMatch = await bcrypt.compare(password, user.user_password);
      } catch (e) {
        // Password might not be hashed
        isMatch = false;
      }
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.acount_id,
        employee_id: user.employee_id,
        email: user.user_email,
        route_access: user.route_access,
      },
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "8h" });

    return res.json({
      token,
      user: {
        id: user.acount_id,
        employee_id: user.employee_id,
        email: user.user_email,
        route_access: user.route_access,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const logout = async (req, res) => {
  try {
    // For JWT, logout is handled client-side by removing the token
    // But we can log the event server-side
    console.log("User logged out:", req.user?.email || "unknown");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  login,
  getMe,
  logout,
};
