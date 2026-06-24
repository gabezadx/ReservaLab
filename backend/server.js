const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const reservaRoutes = require("./routes/reservas");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API ReservaLab funcionando." });
});

app.use("/auth", authRoutes);
app.use("/reservas", reservaRoutes);
app.use("/admin", adminRoutes);

const porta = process.env.PORT || 3000;

app.listen(porta, () => {
  console.log(`Servidor ReservaLab rodando na porta ${porta}`);
});
