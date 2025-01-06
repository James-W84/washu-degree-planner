const express = require("express");
const cors = require("cors");
const prisma = require("./models/index");

const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/user", userRoutes);
app.use("/course", courseRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
