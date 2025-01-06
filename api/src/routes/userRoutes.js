const express = require("express");
const prisma = require("./../models/index");
const { hashPassword, verifyPassword, verifyToken } = require("./../util/auth");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashed_password = await hashPassword(password);

  try {
    const result = await prisma.user.create({
      data: {
        email,
        password: hashed_password,
      },
    });

    res.status(201).json({ id: result.id, email: result.email });
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(400).json({
        error:
          "User with this email already exists. If you already signed up using Google, please use Google to login.",
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!result) {
      res.status(404).json({
        error:
          "User with this email not found. If you originally signed up with Google, please login using Google.",
      });
    } else if (await verifyPassword(password, result.password)) {
      res.status(200).json({ id: result.id, email });
    } else {
      res.status(403).json({ error: "Incorrect password." });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const payload = await verifyToken(token);
    const googleId = payload.sub;

    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      const response = await prisma.user.create({
        data: { email: payload.email, googleId, name: payload.name },
      });
      res.status(201).json({ id: response.id, email: response.email });
    } else {
      res.status(200).json({ id: user.id, email: user.email });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
