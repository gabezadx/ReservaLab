const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const reservaRoutes = require("./routes/reservas");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos do frontend
app.use(express.static(path.join(__dirname, "../front")));

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/index.html"));
});

// Rotas da API
app.use("/auth", authRoutes);
app.use("/reservas", reservaRoutes);
app.use("/admin", adminRoutes);

const porta = process.env.PORT || 3000;

app.listen(porta, () => {
  console.log(`Servidor ReservaLab rodando na porta ${porta}`);
});