const db = require("./db");

async function registrarAuditoria(usuarioId, acao, descricao = "") {
  try {
    await db.execute(
      "INSERT INTO auditoria (usuario_id, acao, descricao) VALUES (?, ?, ?)",
      [usuarioId || null, acao, descricao]
    );
  } catch (error) {
    console.error("Erro ao registrar auditoria:", error.message);
  }
}

module.exports = registrarAuditoria;
