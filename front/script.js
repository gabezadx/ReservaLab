const DB_KEY = 'reservalab_db_v2';
const SESSION_KEY = 'reservalab_session_v2';

const permissions = {
  professor: ['create_reservation', 'view_own', 'cancel_own'],
  coordenacao: ['view_all', 'approve_reservation', 'reject_reservation', 'cancel_any', 'view_audit'],
  admin: ['view_all', 'approve_reservation', 'reject_reservation', 'cancel_any', 'manage_registers', 'view_audit']
};

const profileNames = {
  professor: 'Professor',
  coordenacao: 'Coordenação',
  admin: 'Administrador'
};

const initialData = {
  users: [],
  labs: ['Laboratório 01', 'Laboratório 02', 'Laboratório de Informática'],
  turmas: ['ADS 1º Semestre', 'Engenharia 3º Semestre', 'Técnico em Informática'],
  reservas: [
    { id: crypto.randomUUID(), professorEmail: 'professor@reservalab.com', professor: 'Professor', laboratorio: 'Laboratório 01', turma: 'ADS 1º Semestre', disciplina: 'Segurança da Informação', data: '2026-06-05', inicio: '19:00', fim: '21:00', status: 'pendente' },
    { id: crypto.randomUUID(), professorEmail: 'professor@reservalab.com', professor: 'Professor', laboratorio: 'Laboratório 02', turma: 'Engenharia 3º Semestre', disciplina: 'Banco de Dados', data: '2026-06-06', inicio: '18:30', fim: '20:00', status: 'aprovada' }
  ],
  audit: []
};

let db = null;
let currentUser = null;

const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const loginForm = document.getElementById('loginForm');
const loginErro = document.getElementById('loginErro');
const logoutBtn = document.getElementById('logoutBtn');
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');
const usuarioNome = document.getElementById('usuarioNome');
const usuarioTipo = document.getElementById('usuarioTipo');
const listaReservas = document.getElementById('listaReservas');
const listaAdmin = document.getElementById('listaAdmin');
const listaAuditoria = document.getElementById('listaAuditoria');
const calendario = document.getElementById('calendario');
const formReserva = document.getElementById('formReserva');
const mensagemForm = document.getElementById('mensagemForm');
const laboratorioSelect = document.getElementById('laboratorio');
const turmaSelect = document.getElementById('turma');

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function initDatabase() {
  const saved = localStorage.getItem(DB_KEY);
  if (saved) {
    db = JSON.parse(saved);
    return;
  }

  const senhaHash = await sha256('123456');
  db = structuredClone(initialData);
  db.users = [
    { name: 'Professor', email: 'professor@reservalab.com', role: 'professor', passwordHash: senhaHash },
    { name: 'Coordenação', email: 'coordenacao@reservalab.com', role: 'coordenacao', passwordHash: senhaHash },
    { name: 'Administrador', email: 'admin@reservalab.com', role: 'admin', passwordHash: senhaHash }
  ];
  addAudit('sistema', 'Banco local criado com usuários de teste e senhas com hash.', false);
  saveDb();
}

function saveDb() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function saveSession(user) { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
function clearSession() { sessionStorage.removeItem(SESSION_KEY); }

function hasPermission(permission) {
  return currentUser && permissions[currentUser.role]?.includes(permission);
}

function blockAction(action) {
  const msg = `Ação bloqueada: seu perfil (${profileNames[currentUser.role]}) não possui permissão para ${action}.`;
  addAudit(currentUser.email, msg, true);
  alert(msg);
  renderAll();
}

function addAudit(user, action, blocked = false) {
  if (!db) return;
  db.audit.unshift({ id: crypto.randomUUID(), user, action, blocked, date: new Date().toLocaleString('pt-BR') });
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginSenha').value;
  const user = db.users.find(u => u.email === email);
  const passwordHash = await sha256(password);

  if (!user || user.passwordHash !== passwordHash) {
    loginErro.textContent = 'E-mail ou senha inválidos.';
    loginErro.classList.remove('hidden');
    addAudit(email || 'desconhecido', 'Tentativa de login inválida.', true);
    saveDb();
    return;
  }

  currentUser = { name: user.name, email: user.email, role: user.role };
  saveSession(currentUser);
  addAudit(currentUser.email, 'Login realizado com sucesso.');
  saveDb();
  showApp();
});

logoutBtn.addEventListener('click', () => {
  addAudit(currentUser.email, 'Logout realizado.');
  saveDb();
  currentUser = null;
  clearSession();
  loginView.classList.remove('hidden');
  appView.classList.add('hidden');
});

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    const permission = button.dataset.permission;
    if (permission && !hasPermission(permission)) {
      blockAction(`acessar ${button.textContent}`);
      return;
    }
    navButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.section).classList.add('active');
    pageTitle.textContent = button.textContent;
  });
});

formReserva.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!hasPermission('create_reservation')) {
    mensagem('error', 'Apenas professor pode criar reserva. Esta ação foi bloqueada e registrada na auditoria.');
    blockAction('criar reserva de laboratório');
    return;
  }

  const nova = {
    id: crypto.randomUUID(),
    professorEmail: currentUser.email,
    professor: currentUser.name,
    laboratorio: document.getElementById('laboratorio').value,
    turma: document.getElementById('turma').value,
    disciplina: document.getElementById('disciplina').value,
    data: document.getElementById('data').value,
    inicio: document.getElementById('inicio').value,
    fim: document.getElementById('fim').value,
    status: 'pendente'
  };

  if (nova.inicio >= nova.fim) {
    mensagem('error', 'O horário final deve ser maior que o horário inicial.');
    return;
  }

  if (existeConflito(nova)) {
    mensagem('error', 'Conflito de horário: já existe reserva pendente ou aprovada para este laboratório.');
    addAudit(currentUser.email, `Reserva bloqueada por conflito no ${nova.laboratorio}.`, true);
    saveDb();
    renderAll();
    return;
  }

  db.reservas.push(nova);
  addAudit(currentUser.email, `Solicitou reserva no ${nova.laboratorio} em ${formatDate(nova.data)}.`);
  saveDb();
  formReserva.reset();
  mensagem('success', 'Reserva solicitada com sucesso. Status: pendente.');
  renderAll();
});

function existeConflito(nova) {
  return db.reservas.some(r =>
    r.laboratorio === nova.laboratorio &&
    r.data === nova.data &&
    ['pendente', 'aprovada'].includes(r.status) &&
    nova.inicio < r.fim && nova.fim > r.inicio
  );
}

function atualizarStatus(id, status) {
  const reserva = db.reservas.find(r => r.id === id);
  if (!reserva) return;
  const permission = status === 'aprovada' ? 'approve_reservation' : status === 'recusada' ? 'reject_reservation' : 'cancel_any';
  if (!hasPermission(permission)) {
    blockAction(`${status} reserva`);
    return;
  }
  reserva.status = status;
  addAudit(currentUser.email, `Alterou reserva ${reserva.id.slice(0, 8)} para ${status}.`);
  saveDb();
  renderAll();
}

function cancelarMinhaReserva(id) {
  const reserva = db.reservas.find(r => r.id === id);
  if (!reserva) return;
  if (reserva.professorEmail !== currentUser.email || !hasPermission('cancel_own')) {
    blockAction('cancelar reserva de outro usuário');
    return;
  }
  reserva.status = 'cancelada';
  addAudit(currentUser.email, `Cancelou a própria reserva ${reserva.id.slice(0, 8)}.`);
  saveDb();
  renderAll();
}

function showApp() {
  loginView.classList.add('hidden');
  appView.classList.remove('hidden');
  usuarioNome.textContent = currentUser.name;
  usuarioTipo.textContent = profileNames[currentUser.role];
  loginErro.classList.add('hidden');

  const btnReservas = document.querySelector('[data-section="reservas"]');
  const btnNovaReserva = document.querySelector('[data-section="novaReserva"]');

  if (currentUser.role === 'professor') {
    btnReservas.textContent = 'Minhas Reservas';
    btnNovaReserva.style.display = 'block';
  } else {
    btnReservas.textContent = 'Todas as Reservas';
    btnNovaReserva.style.display = 'none';
  }

  renderSelects();
  renderAll();
}

function renderSelects() {
  laboratorioSelect.innerHTML = db.labs.map(l => `<option value="${l}">${l}</option>`).join('');
  turmaSelect.innerHTML = db.turmas.map(t => `<option value="${t}">${t}</option>`).join('');
}

function renderAll() {
  document.getElementById('qtdPendentes').textContent = db.reservas.filter(r => r.status === 'pendente').length;
  document.getElementById('qtdAprovadas').textContent = db.reservas.filter(r => r.status === 'aprovada').length;
  document.getElementById('qtdLabs').textContent = db.labs.length;
  document.getElementById('qtdLogs').textContent = db.audit.length;
  renderMinhasReservas();
  renderAdmin();
  renderCalendario();
  renderAuditoria();
}

function reservaCard(r, admin = false) {
  const canCancelOwn = r.professorEmail === currentUser.email && r.status !== 'cancelada' && hasPermission('cancel_own');
  return `
    <div class="reservation-item">
      <div class="reservation-top">
        <div>
          <strong>${r.laboratorio}</strong><br>
          <span>${r.disciplina} • ${r.turma}</span><br>
          <small>${formatDate(r.data)} das ${r.inicio} às ${r.fim} • Professor: ${r.professor}</small>
        </div>
        <span class="badge ${r.status}">${r.status}</span>
      </div>
      <div class="actions">
        ${admin && r.status === 'pendente' ? `<button class="success" onclick="atualizarStatus('${r.id}', 'aprovada')">Aprovar</button><button class="warn" onclick="atualizarStatus('${r.id}', 'recusada')">Recusar</button>` : ''}
        ${admin && r.status !== 'cancelada' ? `<button class="danger" onclick="atualizarStatus('${r.id}', 'cancelada')">Cancelar</button>` : ''}
        ${canCancelOwn ? `<button class="danger" onclick="cancelarMinhaReserva('${r.id}')">Cancelar minha reserva</button>` : ''}
      </div>
    </div>`;
}

function renderMinhasReservas() {
  const minhas = currentUser.role === 'professor'
    ? db.reservas.filter(r => r.professorEmail === currentUser.email)
    : db.reservas;

  listaReservas.innerHTML = minhas.length
    ? minhas.map(r => reservaCard(r, currentUser.role !== 'professor')).join('')
    : (currentUser.role === 'professor'
      ? '<p class="muted">Nenhuma reserva encontrada para este usuário.</p>'
      : '<p class="muted">Nenhuma reserva cadastrada.</p>');
}

function renderAdmin() {
  if (!hasPermission('view_all')) {
    listaAdmin.innerHTML = '<p class="muted">Sem permissão para visualizar todas as reservas.</p>';
    return;
  }
  listaAdmin.innerHTML = db.reservas.map(r => reservaCard(r, true)).join('');
}

function renderCalendario() {
  const ordenadas = [...db.reservas].sort((a, b) => `${a.data} ${a.inicio}`.localeCompare(`${b.data} ${b.inicio}`));
  calendario.innerHTML = ordenadas.map(r => reservaCard(r)).join('');
}

function renderAuditoria() {
  if (!hasPermission('view_audit')) {
    listaAuditoria.innerHTML = '<p class="muted">Sem permissão para visualizar auditoria.</p>';
    return;
  }
  listaAuditoria.innerHTML = db.audit.map(log => `
    <div class="audit-item">
      <strong>${log.blocked ? 'Bloqueio / Segurança' : 'Evento'}</strong>
      <span>${log.action}</span>
      <small>${log.date} • Usuário: ${log.user}</small>
    </div>`).join('');
}

function mensagem(type, text) {
  mensagemForm.textContent = text;
  mensagemForm.className = `message ${type === 'error' ? 'error' : ''}`;
}

function formatDate(date) {
  if (!date) return '-';
  return date.split('-').reverse().join('/');
}

(async function start() {
  await initDatabase();
  const savedSession = sessionStorage.getItem(SESSION_KEY);
  if (savedSession) {
    currentUser = JSON.parse(savedSession);
    showApp();
  }
})();
