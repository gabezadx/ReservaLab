const reservas = [
  {
    professor: 'Professor',
    laboratorio: 'Laboratório 01',
    turma: 'ADS 1º Semestre',
    disciplina: 'Segurança da Informação',
    data: '2026-06-05',
    inicio: '19:00',
    fim: '21:00',
    status: 'pendente'
  },
  {
    professor: 'Professor',
    laboratorio: 'Laboratório 02',
    turma: 'Engenharia 3º Semestre',
    disciplina: 'Banco de Dados',
    data: '2026-06-06',
    inicio: '18:30',
    fim: '20:00',
    status: 'aprovada'
  },
  {
    professor: 'João Silva',
    laboratorio: 'Laboratório de Informática',
    turma: 'Técnico em Informática',
    disciplina: 'Redes',
    data: '2026-06-07',
    inicio: '19:00',
    fim: '21:00',
    status: 'pendente'
  }
];

const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');
const tipoUsuario = document.getElementById('tipoUsuario');
const usuarioNome = document.getElementById('usuarioNome');
const usuarioTipo = document.getElementById('usuarioTipo');
const listaReservas = document.getElementById('listaReservas');
const listaAdmin = document.getElementById('listaAdmin');
const calendario = document.getElementById('calendario');
const formReserva = document.getElementById('formReserva');
const mensagemForm = document.getElementById('mensagemForm');
const adminOnlyItems = document.querySelectorAll('.admin-only');
const professorOnlyItems = document.querySelectorAll('.professor-only');

function obterPerfilAtual() {
  return tipoUsuario.value;
}

function obterNomeProfessorAtual() {
  return 'Professor';
}

function obterMinhasReservas() {
  const professorAtual = obterNomeProfessorAtual();
  return reservas.filter(reserva => reserva.professor === professorAtual);
}

function ativarSecao(sectionId) {
  navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.section === sectionId));
  sections.forEach(section => section.classList.toggle('active', section.id === sectionId));

  const botaoAtivo = [...navButtons].find(btn => btn.dataset.section === sectionId);
  pageTitle.textContent = botaoAtivo ? botaoAtivo.textContent : 'Dashboard';
}

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('hidden')) {
      return;
    }

    ativarSecao(button.dataset.section);
  });
});

tipoUsuario.addEventListener('change', atualizarPerfil);

function atualizarPerfil() {
  const isAdmin = obterPerfilAtual() === 'admin';

  usuarioNome.textContent = isAdmin ? 'Coordenação' : obterNomeProfessorAtual();
  usuarioTipo.textContent = isAdmin ? 'Administrador' : 'Professor';

  adminOnlyItems.forEach(item => item.classList.toggle('hidden', !isAdmin));
  professorOnlyItems.forEach(item => item.classList.toggle('hidden', isAdmin));

  const secaoAtual = document.querySelector('.section.active')?.id;
  const secaoInvalida = (isAdmin && secaoAtual === 'novaReserva') || (!isAdmin && secaoAtual === 'admin');

  if (secaoInvalida) {
    ativarSecao('dashboard');
  }

  mensagemForm.textContent = '';
  renderizarReservas();
  renderizarAdmin();
  renderizarCalendario();
}

function statusBadge(status) {
  return `<span class="badge ${status}">${status}</span>`;
}

function renderizarReservas() {
  const minhas = obterMinhasReservas();

  if (!minhas.length) {
    listaReservas.innerHTML = '<tr><td colspan="7">Nenhuma reserva encontrada.</td></tr>';
    atualizarIndicadores();
    return;
  }

  listaReservas.innerHTML = minhas.map((reserva, index) => `
    <tr>
      <td>${reserva.laboratorio}</td>
      <td>${reserva.turma}</td>
      <td>${reserva.disciplina}</td>
      <td>${formatarData(reserva.data)}</td>
      <td>${reserva.inicio} às ${reserva.fim}</td>
      <td>${statusBadge(reserva.status)}</td>
      <td><button class="action-btn danger" onclick="cancelarReserva(${index})">Cancelar</button></td>
    </tr>
  `).join('');

  atualizarIndicadores();
}

function renderizarAdmin() {
  if (obterPerfilAtual() !== 'admin') {
    listaAdmin.innerHTML = '';
    return;
  }

  listaAdmin.innerHTML = reservas.map((reserva, index) => `
    <tr>
      <td>${reserva.professor}</td>
      <td>${reserva.laboratorio}</td>
      <td>${formatarData(reserva.data)}</td>
      <td>${reserva.inicio} às ${reserva.fim}</td>
      <td>${statusBadge(reserva.status)}</td>
      <td>
        <button class="action-btn" onclick="alterarStatus(${index}, 'aprovada')">Aprovar</button>
        <button class="action-btn danger" onclick="alterarStatus(${index}, 'recusada')">Recusar</button>
        <button class="action-btn danger" onclick="alterarStatus(${index}, 'cancelada')">Cancelar</button>
      </td>
    </tr>
  `).join('');
}

function renderizarCalendario() {
  calendario.innerHTML = '';

  for (let dia = 1; dia <= 30; dia++) {
    const data = `2026-06-${String(dia).padStart(2, '0')}`;
    const reservasDia = reservas.filter(reserva => reserva.data === data && reserva.status !== 'cancelada' && reserva.status !== 'recusada');

    const div = document.createElement('div');
    div.className = 'day';
    div.innerHTML = `<strong>${dia}/06</strong>`;

    reservasDia.forEach(reserva => {
      div.innerHTML += `<span class="event">${reserva.laboratorio}<br>${reserva.inicio}</span>`;
    });

    calendario.appendChild(div);
  }
}

formReserva.addEventListener('submit', event => {
  event.preventDefault();

  if (obterPerfilAtual() !== 'professor') {
    mensagemForm.textContent = 'Apenas professores podem solicitar reservas.';
    mensagemForm.style.color = '#991b1b';
    return;
  }

  const novaReserva = {
    professor: obterNomeProfessorAtual(),
    laboratorio: document.getElementById('laboratorio').value,
    turma: document.getElementById('turma').value,
    disciplina: document.getElementById('disciplina').value.trim(),
    data: document.getElementById('data').value,
    inicio: document.getElementById('inicio').value,
    fim: document.getElementById('fim').value,
    status: 'pendente'
  };

  if (!novaReserva.data || !novaReserva.inicio || !novaReserva.fim || !novaReserva.disciplina) {
    mensagemForm.textContent = 'Preencha todos os campos obrigatórios.';
    mensagemForm.style.color = '#991b1b';
    return;
  }

  if (novaReserva.fim <= novaReserva.inicio) {
    mensagemForm.textContent = 'O horário final deve ser maior que o horário inicial.';
    mensagemForm.style.color = '#991b1b';
    return;
  }

  const conflito = reservas.some(reserva =>
    reserva.laboratorio === novaReserva.laboratorio &&
    reserva.data === novaReserva.data &&
    !['cancelada', 'recusada'].includes(reserva.status) &&
    novaReserva.inicio < reserva.fim &&
    novaReserva.fim > reserva.inicio
  );

  if (conflito) {
    mensagemForm.textContent = 'Não foi possível reservar: já existe conflito de horário para este laboratório.';
    mensagemForm.style.color = '#991b1b';
    return;
  }

  reservas.push(novaReserva);
  mensagemForm.textContent = 'Reserva solicitada com sucesso! Status: pendente.';
  mensagemForm.style.color = '#166534';

  formReserva.reset();
  renderizarReservas();
  renderizarAdmin();
  renderizarCalendario();
});

function cancelarReserva(index) {
  const minhas = obterMinhasReservas();
  const reservaSelecionada = minhas[index];
  const indiceReal = reservas.indexOf(reservaSelecionada);

  if (indiceReal >= 0) {
    reservas[indiceReal].status = 'cancelada';
  }

  renderizarReservas();
  renderizarAdmin();
  renderizarCalendario();
}

function alterarStatus(index, status) {
  reservas[index].status = status;
  renderizarReservas();
  renderizarAdmin();
  renderizarCalendario();
}

function atualizarIndicadores() {
  const base = obterPerfilAtual() === 'admin' ? reservas : obterMinhasReservas();

  document.getElementById('qtdPendentes').textContent = base.filter(r => r.status === 'pendente').length;
  document.getElementById('qtdAprovadas').textContent = base.filter(r => r.status === 'aprovada').length;
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

atualizarPerfil();
renderizarReservas();
renderizarAdmin();
renderizarCalendario();
