const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const registrarAuditoria = require("../audit");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  const [usuarios] = await db.execute(
    "SELECT * FROM usuarios WHERE email = ? AND ativo = 1",
    [email]
  );

  if (usuarios.length === 0) {
    return res.status(401).json({ erro: "Usuário ou senha inválidos." });
  }

  const usuario = usuarios[0];
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

  if (!senhaCorreta) {
    await registrarAuditoria(usuario.id, "LOGIN_FALHOU", "Senha incorreta.");
    return res.status(401).json({ erro: "Usuário ou senha inválidos." });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    },
    process.env.JWT_SECRET || "segredo",
    { expiresIn: "2h" }
  );

  await registrarAuditoria(usuario.id, "LOGIN", "Login realizado com sucesso.");

  res.json({
    mensagem: "Login realizado com sucesso.",
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    }
  });
});

module.exports = router;
