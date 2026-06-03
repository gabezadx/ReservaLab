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

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(button.dataset.section).classList.add('active');
    pageTitle.textContent = button.textContent;
  });
});

tipoUsuario.addEventListener('change', atualizarPerfil);

function atualizarPerfil() {
  const isAdmin = tipoUsuario.value === 'admin';

  usuarioNome.textContent = isAdmin ? 'Coordenação' : 'Professor';
  usuarioTipo.textContent = isAdmin ? 'Administrador' : 'Professor';

  document.querySelectorAll('.admin-only').forEach(item => {
    item.classList.toggle('hidden', !isAdmin);
  });

  renderizarReservas();
  renderizarAdmin();
}

function statusBadge(status) {
  return `<span class="badge ${status}">${status}</span>`;
}

function renderizarReservas() {
  const minhas = reservas.filter(reserva => reserva.professor === 'Professor');

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
    const reservasDia = reservas.filter(reserva => reserva.data === data);

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

  const novaReserva = {
    professor: 'Professor',
    laboratorio: document.getElementById('laboratorio').value,
    turma: document.getElementById('turma').value,
    disciplina: document.getElementById('disciplina').value,
    data: document.getElementById('data').value,
    inicio: document.getElementById('inicio').value,
    fim: document.getElementById('fim').value,
    status: 'pendente'
  };

  const conflito = reservas.some(reserva =>
    reserva.laboratorio === novaReserva.laboratorio &&
    reserva.data === novaReserva.data &&
    reserva.status !== 'cancelada' &&
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
  const minhas = reservas.filter(reserva => reserva.professor === 'Professor');
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
  document.getElementById('qtdPendentes').textContent = reservas.filter(r => r.status === 'pendente').length;
  document.getElementById('qtdAprovadas').textContent = reservas.filter(r => r.status === 'aprovada').length;
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

atualizarPerfil();
renderizarReservas();
renderizarAdmin();
renderizarCalendario();
