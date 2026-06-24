const express = require("express");
const db = require("../db");
const autenticar = require("../middleware/auth");
const permitirPerfis = require("../middleware/roles");
const registrarAuditoria = require("../audit");

const router = express.Router();

router.get("/", autenticar, async (req, res) => {
  let sql = `
    SELECT r.*, u.nome AS professor, l.nome AS laboratorio
    FROM reservas r
    JOIN usuarios u ON u.id = r.professor_id
    JOIN laboratorios l ON l.id = r.laboratorio_id
  `;
  const params = [];

  if (req.usuario.perfil === "professor") {
    sql += " WHERE r.professor_id = ?";
    params.push(req.usuario.id);
  }

  sql += " ORDER BY r.data_reserva DESC, r.hora_inicio DESC";

  const [reservas] = await db.execute(sql, params);
  res.json(reservas);
});

router.post("/", autenticar, permitirPerfis("professor"), async (req, res) => {
  const { laboratorio_id, data_reserva, hora_inicio, hora_fim, turma, disciplina } = req.body;

  if (!laboratorio_id || !data_reserva || !hora_inicio || !hora_fim) {
    return res.status(400).json({ erro: "Preencha laboratório, data e horários." });
  }

  const [conflitos] = await db.execute(
    `
    SELECT id FROM reservas
    WHERE laboratorio_id = ?
      AND data_reserva = ?
      AND status IN ('pendente', 'aprovada')
      AND hora_inicio < ?
      AND hora_fim > ?
    `,
    [laboratorio_id, data_reserva, hora_fim, hora_inicio]
  );

  if (conflitos.length > 0) {
    await registrarAuditoria(req.usuario.id, "RESERVA_BLOQUEADA", "Tentativa de reserva com conflito de horário.");
    return res.status(409).json({ erro: "Já existe reserva nesse laboratório e horário." });
  }

  const [resultado] = await db.execute(
    `
    INSERT INTO reservas
    (professor_id, laboratorio_id, data_reserva, hora_inicio, hora_fim, turma, disciplina, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pendente')
    `,
    [req.usuario.id, laboratorio_id, data_reserva, hora_inicio, hora_fim, turma || "", disciplina || ""]
  );

  await registrarAuditoria(req.usuario.id, "RESERVA_CRIADA", `Reserva criada com ID ${resultado.insertId}.`);

  res.status(201).json({ mensagem: "Reserva criada com sucesso.", id: resultado.insertId });
});

router.patch("/:id/status", autenticar, permitirPerfis("coordenacao", "administrador"), async (req, res) => {
  const { status } = req.body;
  const statusPermitidos = ["aprovada", "recusada", "cancelada"];

  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ erro: "Status inválido." });
  }

  await db.execute("UPDATE reservas SET status = ? WHERE id = ?", [status, req.params.id]);

  await registrarAuditoria(
    req.usuario.id,
    "STATUS_RESERVA_ALTERADO",
    `Reserva ${req.params.id} alterada para ${status}.`
  );

  res.json({ mensagem: "Status da reserva atualizado." });
});

router.delete("/:id", autenticar, async (req, res) => {
  const [reservas] = await db.execute("SELECT * FROM reservas WHERE id = ?", [req.params.id]);

  if (reservas.length === 0) {
    return res.status(404).json({ erro: "Reserva não encontrada." });
  }

  const reserva = reservas[0];
  const dono = reserva.professor_id === req.usuario.id;
  const perfilAdmin = ["coordenacao", "administrador"].includes(req.usuario.perfil);

  if (!dono && !perfilAdmin) {
    await registrarAuditoria(req.usuario.id, "CANCELAMENTO_BLOQUEADO", "Tentativa de cancelar reserva de outro professor.");
    return res.status(403).json({ erro: "Você não pode cancelar esta reserva." });
  }

  await db.execute("UPDATE reservas SET status = 'cancelada' WHERE id = ?", [req.params.id]);
  await registrarAuditoria(req.usuario.id, "RESERVA_CANCELADA", `Reserva ${req.params.id} cancelada.`);

  res.json({ mensagem: "Reserva cancelada." });
});

module.exports = router;
