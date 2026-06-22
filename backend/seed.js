const bcrypt = require("bcrypt");
const db = require("./db");

async function seed() {
  const senha = await bcrypt.hash("123456", 10);

  const usuarios = [
    ["Professor Teste", "professor@reservalab.com", senha, "professor"],
    ["Coordenação Teste", "coordenacao@reservalab.com", senha, "coordenacao"],
    ["Administrador Teste", "admin@reservalab.com", senha, "administrador"]
  ];

  for (const usuario of usuarios) {
    await db.execute(
      `
      INSERT INTO usuarios (nome, email, senha_hash, perfil)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE nome = VALUES(nome), perfil = VALUES(perfil)
      `,
      usuario
    );
  }

  const labs = [
    ["Laboratório de Informática 01", 30, "Bloco A"],
    ["Laboratório de Redes", 25, "Bloco B"],
    ["Laboratório Maker", 20, "Bloco C"]
  ];

  for (const lab of labs) {
    await db.execute(
      `
      INSERT INTO laboratorios (nome, capacidade, localizacao)
      SELECT ?, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM laboratorios WHERE nome = ?)
      `,
      [lab[0], lab[1], lab[2], lab[0]]
    );
  }

  console.log("Usuários e laboratórios de teste criados.");
  process.exit();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
