const registrarAuditoria = require("../audit");

function permitirPerfis(...perfisPermitidos) {
  return async (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
      await registrarAuditoria(
        req.usuario ? req.usuario.id : null,
        "ACESSO_BLOQUEADO",
        `Tentativa de acesso negada. Perfis permitidos: ${perfisPermitidos.join(", ")}`
      );

      return res.status(403).json({
        erro: "Acesso bloqueado por falta de permissão."
      });
    }

    next();
  };
}

module.exports = permitirPerfis;
