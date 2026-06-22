const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const autenticar = require("../middleware/auth");
const permitirPerfis = require("../middleware/roles");
const registrarAuditoria = require("../audit");

const router = express.Router();

router.get("/usuarios", autenticar, permitirPerfis("administrador"), async (req, res) => {
  const [usuarios] = await db.execute("SELECT id, nome, email, perfil, ativo FROM usuarios ORDER BY nome");
  res.json(usuarios);
});

router.post("/usuarios", autenticar, permitirPerfis("administrador"), async (req, res) => {
  const { nome, email, senha, perfil } = req.body;

  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({ erro: "Preencha nome, email, senha e perfil." });
  }

  const senha_hash = await bcrypt.hash(senha, 10);

  const [resultado] = await db.execute(
    "INSERT INTO usuarios (nome, email, senha_hash, perfil) VALUES (?, ?, ?, ?)",
    [nome, email, senha_hash, perfil]
  );

  await registrarAuditoria(req.usuario.id, "USUARIO_CRIADO", `Usuário ${email} criado.`);
  res.status(201).json({ mensagem: "Usuário criado.", id: resultado.insertId });
});

router.get("/laboratorios", autenticar, async (req, res) => {
  const [labs] = await db.execute("SELECT * FROM laboratorios ORDER BY nome");
  res.json(labs);
});

router.post("/laboratorios", autenticar, permitirPerfis("administrador", "coordenacao"), async (req, res) => {
  const { nome, capacidade, localizacao } = req.body;

  if (!nome || !capacidade) {
    return res.status(400).json({ erro: "Preencha nome e capacidade." });
  }

  const [resultado] = await db.execute(
    "INSERT INTO laboratorios (nome, capacidade, localizacao) VALUES (?, ?, ?)",
    [nome, capacidade, localizacao || ""]
  );

  await registrarAuditoria(req.usuario.id, "LABORATORIO_CRIADO", `Laboratório ${nome} criado.`);
  res.status(201).json({ mensagem: "Laboratório criado.", id: resultado.insertId });
});

router.get("/auditoria", autenticar, permitirPerfis("administrador", "coordenacao"), async (req, res) => {
  const [logs] = await db.execute(`
    SELECT a.*, u.nome AS usuario, u.perfil
    FROM auditoria a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    ORDER BY a.data_hora DESC
    LIMIT 100
  `);

  res.json(logs);
});

module.exports = router;
